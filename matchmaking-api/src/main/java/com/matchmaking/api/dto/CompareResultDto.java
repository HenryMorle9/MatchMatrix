package com.matchmaking.api.dto;

import java.util.List;

/**
 * Wraps the results of running all algorithms on the same graph.
 * The frontend uses this to render a comparison table.
 */
public class CompareResultDto {

    private List<TeamResultDto> results;

    public CompareResultDto() {}

    public CompareResultDto(List<TeamResultDto> results) {
        this.results = results;
    }

    public List<TeamResultDto> getResults() { return results; }
    public void setResults(List<TeamResultDto> results) { this.results = results; }
}
