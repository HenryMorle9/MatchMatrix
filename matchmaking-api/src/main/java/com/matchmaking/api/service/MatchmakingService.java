package com.matchmaking.api.service;

import com.matchmaking.algorithms.DataRow;
import com.matchmaking.algorithms.Team;
import com.matchmaking.algorithms.TeamChoose;
import com.matchmaking.api.dto.*;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Vector;

/**
 * Business logic layer that bridges the REST API and the core algorithm.
 *
 * Holds a single TeamChoose instance in memory. The graph is loaded once via
 * loadGraph() and then reused across algorithm runs until replaced.
 */
@Service
public class MatchmakingService {

    private final TeamChoose teamChoose = new TeamChoose();
    private List<EdgeDto> currentEdges = new ArrayList<>();
    private boolean graphLoaded = false;

    /**
     * Converts the DTO edge list into DataRow objects and builds the player graph.
     */
    public void loadGraph(GraphInputDto input) {
        Vector<DataRow> dataRows = new Vector<>();
        for (EdgeDto edge : input.getEdges()) {
            dataRows.add(new DataRow(edge.getP1(), edge.getP2(), edge.getScore()));
        }
        teamChoose.setPlayerGraph(dataRows);
        currentEdges = new ArrayList<>(input.getEdges());
        graphLoaded = true;
    }

    /**
     * Returns the edges currently loaded in the graph.
     */
    public GraphInputDto getGraph() {
        return new GraphInputDto(currentEdges);
    }

    public boolean isGraphLoaded() {
        return graphLoaded;
    }

    /**
     * Runs a single algorithm and returns the result with timing.
     */
    public TeamResultDto runAlgorithm(RunRequestDto request) {
        Team initTeam = toTeam(request.getInitialTeam());

        long start = System.currentTimeMillis();
        Team resultTeam;

        switch (request.getAlgorithm()) {
            case "localSearchFirst":
                resultTeam = teamChoose.localSearchFirst(initTeam);
                break;
            case "localSearchBest":
                resultTeam = teamChoose.localSearchBest(initTeam);
                break;
            case "guaranteedBestTeam":
                resultTeam = teamChoose.guaranteedBestTeam();
                break;
            default:
                throw new IllegalArgumentException("Unknown algorithm: " + request.getAlgorithm());
        }

        long elapsed = System.currentTimeMillis() - start;

        Team canonical = teamChoose.testWithLowestID(resultTeam);
        Team opposing = teamChoose.otherTeam(canonical);
        Double score = teamChoose.multiPlayerTeamScore(canonical);

        return new TeamResultDto(
                request.getAlgorithm(),
                new ArrayList<>(canonical),
                new ArrayList<>(opposing),
                score,
                elapsed
        );
    }

    /**
     * Runs all three algorithms and returns their results for comparison.
     * Local search methods use the provided initial team; exhaustive search ignores it.
     */
    public CompareResultDto compareAll(List<Integer> initialTeam) {
        List<TeamResultDto> results = new ArrayList<>();

        RunRequestDto req1 = new RunRequestDto();
        req1.setAlgorithm("localSearchFirst");
        req1.setInitialTeam(initialTeam);
        results.add(runAlgorithm(req1));

        RunRequestDto req2 = new RunRequestDto();
        req2.setAlgorithm("localSearchBest");
        req2.setInitialTeam(initialTeam);
        results.add(runAlgorithm(req2));

        RunRequestDto req3 = new RunRequestDto();
        req3.setAlgorithm("guaranteedBestTeam");
        req3.setInitialTeam(initialTeam);
        results.add(runAlgorithm(req3));

        return new CompareResultDto(results);
    }

    /**
     * Converts a list of player IDs into a Team object.
     */
    private Team toTeam(List<Integer> playerIds) {
        Team team = new Team();
        team.addAll(playerIds);
        return team;
    }
}
