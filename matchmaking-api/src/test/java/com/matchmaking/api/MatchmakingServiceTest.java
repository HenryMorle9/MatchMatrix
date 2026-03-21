package com.matchmaking.api;

import com.matchmaking.api.dto.*;
import com.matchmaking.api.service.MatchmakingService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

/**
 * Verifies the service layer against the known sample data.
 */
@DisplayName("Service Layer")
class MatchmakingServiceTest {

    private MatchmakingService service;

    @BeforeEach
    void setUp() {
        service = new MatchmakingService();

        GraphInputDto graph = new GraphInputDto(List.of(
                new EdgeDto(0, 1, 2.0),
                new EdgeDto(0, 2, 1.0),
                new EdgeDto(0, 4, 4.0),
                new EdgeDto(1, 2, 3.0),
                new EdgeDto(1, 6, 5.0),
                new EdgeDto(2, 3, 2.0),
                new EdgeDto(2, 5, 1.0),
                new EdgeDto(2, 6, 2.0),
                new EdgeDto(3, 5, 3.0),
                new EdgeDto(4, 5, 1.0)
        ));
        service.loadGraph(graph);
    }

    @Test
    @DisplayName("Guaranteed Best finds optimal score 20")
    void guaranteedBestTeam_findsOptimalSplit() {
        RunRequestDto req = new RunRequestDto();
        req.setAlgorithm("guaranteedBestTeam");
        req.setInitialTeam(List.of());

        TeamResultDto result = service.runAlgorithm(req);

        assertEquals(List.of(0, 2, 5, 6), result.getTeam());
        assertEquals(20.0, result.getScore());
    }

    @Test
    @DisplayName("Local Search Best from {0,5} finds optimal")
    void localSearchBest_fromGoodStart_findsOptimal() {
        RunRequestDto req = new RunRequestDto();
        req.setAlgorithm("localSearchBest");
        req.setInitialTeam(List.of(0, 5));

        TeamResultDto result = service.runAlgorithm(req);

        assertEquals(List.of(0, 2, 5, 6), result.getTeam());
        assertEquals(20.0, result.getScore());
    }

    @Test
    @DisplayName("Local Search First from {1,3,5} finds local optimum 18")
    void localSearchFirst_fromDifferentStart_findsLocalOptimum() {
        RunRequestDto req = new RunRequestDto();
        req.setAlgorithm("localSearchFirst");
        req.setInitialTeam(List.of(1, 3, 5));

        TeamResultDto result = service.runAlgorithm(req);

        assertEquals(List.of(0, 1, 5), result.getTeam());
        assertEquals(18.0, result.getScore());
    }

    @Test
    @DisplayName("Compare returns all 3 algorithm results")
    void compareAll_returnsThreeResults() {
        CompareResultDto result = service.compareAll(List.of(0, 5));

        assertEquals(3, result.getResults().size());
        assertEquals("localSearchFirst", result.getResults().get(0).getAlgorithm());
        assertEquals("localSearchBest", result.getResults().get(1).getAlgorithm());
        assertEquals("guaranteedBestTeam", result.getResults().get(2).getAlgorithm());
    }
}
