package com.matchmaking.api.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.util.List;

/**
 * Request body for running a single algorithm.
 * The caller picks which algorithm and provides an initial team (for local search methods).
 */
public class RunRequestDto {

    @NotBlank
    private String algorithm;  // "localSearchFirst", "localSearchBest", or "guaranteedBestTeam"

    @NotNull
    private List<Integer> initialTeam;  // player IDs for the starting team

    public RunRequestDto() {}

    public String getAlgorithm() { return algorithm; }
    public void setAlgorithm(String algorithm) { this.algorithm = algorithm; }

    public List<Integer> getInitialTeam() { return initialTeam; }
    public void setInitialTeam(List<Integer> initialTeam) { this.initialTeam = initialTeam; }
}
