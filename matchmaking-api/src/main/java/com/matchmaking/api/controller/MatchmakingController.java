package com.matchmaking.api.controller;

import com.matchmaking.api.dto.CompareResultDto;
import com.matchmaking.api.dto.RunRequestDto;
import com.matchmaking.api.dto.TeamResultDto;
import com.matchmaking.api.service.MatchmakingService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * Runs matchmaking algorithms against the currently loaded graph.
 *
 * POST /api/matchmaking/run      — run a single algorithm
 * POST /api/matchmaking/compare  — run all three and compare results
 */
@RestController
@RequestMapping("/api/matchmaking")
public class MatchmakingController {

    private final MatchmakingService matchmakingService;

    public MatchmakingController(MatchmakingService matchmakingService) {
        this.matchmakingService = matchmakingService;
    }

    @PostMapping("/run")
    public ResponseEntity<TeamResultDto> run(@Valid @RequestBody RunRequestDto request) {
        if (!matchmakingService.isGraphLoaded()) {
            return ResponseEntity.badRequest().build();
        }
        TeamResultDto result = matchmakingService.runAlgorithm(request);
        return ResponseEntity.ok(result);
    }

    @PostMapping("/compare")
    public ResponseEntity<CompareResultDto> compare(@Valid @RequestBody RunRequestDto request) {
        if (!matchmakingService.isGraphLoaded()) {
            return ResponseEntity.badRequest().build();
        }
        CompareResultDto result = matchmakingService.compareAll(request.getInitialTeam());
        return ResponseEntity.ok(result);
    }
}
