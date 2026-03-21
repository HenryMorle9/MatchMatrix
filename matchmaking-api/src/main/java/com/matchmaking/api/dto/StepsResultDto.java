package com.matchmaking.api.dto;

import java.util.List;

/**
 * The full step-by-step result of running a local search algorithm.
 * Contains every intermediate team state from initial to final.
 */
public class StepsResultDto {

    private String algorithm;
    private List<StepDto> steps;
    private long runtimeMs;

    public StepsResultDto() {}

    public StepsResultDto(String algorithm, List<StepDto> steps, long runtimeMs) {
        this.algorithm = algorithm;
        this.steps = steps;
        this.runtimeMs = runtimeMs;
    }

    public String getAlgorithm() { return algorithm; }
    public void setAlgorithm(String algorithm) { this.algorithm = algorithm; }

    public List<StepDto> getSteps() { return steps; }
    public void setSteps(List<StepDto> steps) { this.steps = steps; }

    public long getRuntimeMs() { return runtimeMs; }
    public void setRuntimeMs(long runtimeMs) { this.runtimeMs = runtimeMs; }
}
