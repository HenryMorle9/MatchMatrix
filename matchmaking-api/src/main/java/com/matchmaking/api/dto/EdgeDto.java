package com.matchmaking.api.dto;

import jakarta.validation.constraints.NotNull;

/**
 * One edge in the player graph: two player IDs and their pairing score.
 * This is what the frontend sends for each row of input data.
 */
public class EdgeDto {

    @NotNull
    private Integer p1;

    @NotNull
    private Integer p2;

    @NotNull
    private Double score;

    public EdgeDto() {}

    public EdgeDto(Integer p1, Integer p2, Double score) {
        this.p1 = p1;
        this.p2 = p2;
        this.score = score;
    }

    public Integer getP1() { return p1; }
    public void setP1(Integer p1) { this.p1 = p1; }

    public Integer getP2() { return p2; }
    public void setP2(Integer p2) { this.p2 = p2; }

    public Double getScore() { return score; }
    public void setScore(Double score) { this.score = score; }
}
