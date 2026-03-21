package com.matchmaking.api.dto;

import java.util.List;

/**
 * A single snapshot during a local search algorithm's execution.
 * Captures the team state and score at one point in time.
 */
public class StepDto {

    private int stepNumber;
    private List<Integer> team;
    private List<Integer> opposingTeam;
    private double score;
    private String action;

    public StepDto() {}

    public StepDto(int stepNumber, List<Integer> team, List<Integer> opposingTeam, double score, String action) {
        this.stepNumber = stepNumber;
        this.team = team;
        this.opposingTeam = opposingTeam;
        this.score = score;
        this.action = action;
    }

    public int getStepNumber() { return stepNumber; }
    public void setStepNumber(int stepNumber) { this.stepNumber = stepNumber; }

    public List<Integer> getTeam() { return team; }
    public void setTeam(List<Integer> team) { this.team = team; }

    public List<Integer> getOpposingTeam() { return opposingTeam; }
    public void setOpposingTeam(List<Integer> opposingTeam) { this.opposingTeam = opposingTeam; }

    public double getScore() { return score; }
    public void setScore(double score) { this.score = score; }

    public String getAction() { return action; }
    public void setAction(String action) { this.action = action; }
}
