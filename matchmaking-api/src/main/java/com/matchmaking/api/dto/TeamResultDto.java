package com.matchmaking.api.dto;

import java.util.List;

/**
 * The result of running one algorithm: the team it found, its score, and how long it took.
 */
public class TeamResultDto {

    private String algorithm;
    private List<Integer> team;
    private List<Integer> opposingTeam;
    private Double score;
    private Long runtimeMs;

    public TeamResultDto() {}

    public TeamResultDto(String algorithm, List<Integer> team, List<Integer> opposingTeam,
                         Double score, Long runtimeMs) {
        this.algorithm = algorithm;
        this.team = team;
        this.opposingTeam = opposingTeam;
        this.score = score;
        this.runtimeMs = runtimeMs;
    }

    public String getAlgorithm() { return algorithm; }
    public void setAlgorithm(String algorithm) { this.algorithm = algorithm; }

    public List<Integer> getTeam() { return team; }
    public void setTeam(List<Integer> team) { this.team = team; }

    public List<Integer> getOpposingTeam() { return opposingTeam; }
    public void setOpposingTeam(List<Integer> opposingTeam) { this.opposingTeam = opposingTeam; }

    public Double getScore() { return score; }
    public void setScore(Double score) { this.score = score; }

    public Long getRuntimeMs() { return runtimeMs; }
    public void setRuntimeMs(Long runtimeMs) { this.runtimeMs = runtimeMs; }
}
