package com.matchmaking.api.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import java.util.List;

/**
 * The full graph payload sent by the frontend.
 * Contains a list of edges — each edge is a {p1, p2, score} triple.
 */
public class GraphInputDto {

    @NotEmpty
    @Valid
    private List<EdgeDto> edges;

    public GraphInputDto() {}

    public GraphInputDto(List<EdgeDto> edges) {
        this.edges = edges;
    }

    public List<EdgeDto> getEdges() { return edges; }
    public void setEdges(List<EdgeDto> edges) { this.edges = edges; }
}
