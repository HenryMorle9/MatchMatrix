package com.matchmaking.algorithms;

import static org.junit.jupiter.api.Assertions.*;

import java.util.Arrays;
import java.util.List;
import java.util.Set;
import java.util.TreeSet;
import java.util.Vector;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

/**
 * Unit tests for the core algorithm classes.
 * Uses the assignment sample data (7 players, 10 edges, known optimal score = 20).
 */
@DisplayName("Core Algorithms")
public class SampleTests {

    private TeamChoose allTeams;

    @BeforeEach
    void setUp() {
        allTeams = new TeamChoose();
        allTeams.setPlayerGraph(sampleData());
    }

    private Vector<DataRow> sampleData() {
        Vector<DataRow> data = new Vector<>();
        data.add(new DataRow(0, 1, 2.0));
        data.add(new DataRow(0, 2, 1.0));
        data.add(new DataRow(0, 4, 4.0));
        data.add(new DataRow(1, 2, 3.0));
        data.add(new DataRow(1, 6, 5.0));
        data.add(new DataRow(2, 3, 2.0));
        data.add(new DataRow(2, 5, 1.0));
        data.add(new DataRow(2, 6, 2.0));
        data.add(new DataRow(3, 5, 3.0));
        data.add(new DataRow(4, 5, 1.0));
        return data;
    }

    // === PastPlayDeets ===

    @Test
    @DisplayName("Get player score")
    void testPastPlayA() {
        PastPlayDeets hist = new PastPlayDeets();
        hist.insertPlayerScore(2, 3.5);
        hist.insertPlayerScore(3, 4.0);
        assertEquals(Double.valueOf(3.5), hist.getPlayerScore(2));
    }

    @Test
    @DisplayName("Get total score")
    void testPastPlayB() {
        PastPlayDeets hist = new PastPlayDeets();
        hist.insertPlayerScore(2, 3.5);
        hist.insertPlayerScore(3, 4.0);
        assertEquals(Double.valueOf(7.5), hist.getPlayerScoreTota());
    }

    @Test
    @DisplayName("List past players")
    void testPastPlayC() {
        PastPlayDeets hist = new PastPlayDeets();
        hist.insertPlayerScore(2, 3.5);
        hist.insertPlayerScore(3, 4.0);
        Set<Integer> expected = new TreeSet<>(Arrays.asList(2, 3));
        assertEquals(expected, hist.listPastPlayers());
    }

    @Test
    @DisplayName("Lowest ID played with")
    void testPastPlayD() {
        PastPlayDeets hist = new PastPlayDeets();
        hist.insertPlayerScore(2, 3.5);
        hist.insertPlayerScore(3, 4.0);
        assertEquals(Integer.valueOf(2), hist.hasPlayedWithLowestID());
    }

    // === Graph queries ===

    @Test
    @DisplayName("Player 0 score with player 4 is 4.0")
    void testGetPlayerDetails() {
        assertEquals(Double.valueOf(4.0), allTeams.getPlayerDetails(0).getPlayerScore(4));
    }

    @Test
    @DisplayName("Player 0 lowest ID opponent is 1")
    void testHasPlayedWithLowestID() {
        assertEquals(Integer.valueOf(1), allTeams.hasPlayedWithLowestID(0));
    }

    @Test
    @DisplayName("Player 0 played with {1, 2, 4}")
    void testHasPlayedWithAll() {
        Team expected = new Team();
        expected.add(1);
        expected.add(2);
        expected.add(4);
        assertEquals(expected, allTeams.hasPlayedWithAll(0));
    }

    @Test
    @DisplayName("Score between 0 and 4 is 4.0")
    void testScoreBetween() {
        assertEquals(Double.valueOf(4.0), allTeams.scoreBetween(0, 4));
    }

    @Test
    @DisplayName("Player 1 total cross-team score is 10.0")
    void testSinglePlayerTeamScore() {
        assertEquals(Double.valueOf(10.0), allTeams.singlePlayerTeamScore(1));
    }

    // === Team operations ===

    @Test
    @DisplayName("Other team of {0,3} is {1,2,4,5,6}")
    void testOtherTeam() {
        Team startT = new Team();
        startT.add(0);
        startT.add(3);
        Team expected = new Team();
        expected.add(1);
        expected.add(2);
        expected.add(4);
        expected.add(5);
        expected.add(6);
        assertEquals(expected, allTeams.otherTeam(startT));
    }

    @Test
    @DisplayName("Team {1,3,5} score is 14.0")
    void testMultiPlayerTeamScore() {
        Team t = new Team();
        t.add(1);
        t.add(3);
        t.add(5);
        assertEquals(Double.valueOf(14.0), allTeams.multiPlayerTeamScore(t));
    }

    @Test
    @DisplayName("Lowest ID in {1,3,5,6} is 1")
    void testLowestIDOnTeam() {
        Team t = new Team();
        t.add(1);
        t.add(3);
        t.add(5);
        t.add(6);
        assertEquals(Integer.valueOf(1), allTeams.lowestIDOnTeam(t));
    }

    @Test
    @DisplayName("All players team has 7 members")
    void testAllPlayerTeam() {
        Team expected = new Team();
        expected.add(0);
        expected.add(1);
        expected.add(2);
        expected.add(3);
        expected.add(4);
        expected.add(5);
        expected.add(6);
        assertEquals(expected, allTeams.allPlayerTeam());
    }

    @Test
    @DisplayName("Canonical team contains lowest ID")
    void testTeamT1() {
        Team startT = new Team();
        startT.add(0);
        startT.add(3);
        Team answerT = new Team();
        answerT.add(1);
        answerT.add(2);
        answerT.add(4);
        answerT.add(5);
        answerT.add(6);
        assertEquals(startT, allTeams.testWithLowestID(answerT));
    }

    // === Improvement detection ===

    @Test
    @DisplayName("Adding 6 to {1,3,5} is not better")
    void testIsBetterA() {
        Team t = new Team();
        t.add(1);
        t.add(3);
        t.add(5);
        assertFalse(allTeams.isBetter(t, 6));
    }

    @Test
    @DisplayName("Removing 6 from {1,3,5,6} is better")
    void testIsBetterB() {
        Team t = new Team();
        t.add(1);
        t.add(3);
        t.add(5);
        t.add(6);
        assertTrue(allTeams.isBetter(t, 6));
    }

    @Test
    @DisplayName("First add improvement for {1,3,5} is player 0")
    void testFirstSingleAddedImprovement() {
        Team t = new Team();
        t.add(1);
        t.add(3);
        t.add(5);
        assertEquals(Integer.valueOf(0), allTeams.firstSingleAddedImprovement(t));
    }

    @Test
    @DisplayName("First remove improvement for {1,3,5} is player 3")
    void testFirstSingleRemovedImprovement() {
        Team t = new Team();
        t.add(1);
        t.add(3);
        t.add(5);
        assertEquals(Integer.valueOf(3), allTeams.firstSingleRemovedImprovement(t));
    }

    @Test
    @DisplayName("Best add improvement for {3,5} is player 1")
    void testBestSingleAddedImprovement() {
        Team t = new Team();
        t.add(3);
        t.add(5);
        assertEquals(Integer.valueOf(1), allTeams.bestSingleAddedImprovement(t));
    }

    @Test
    @DisplayName("Best remove improvement for {1,3,5,6} is player 6")
    void testBestSingleRemovedImprovement() {
        Team t = new Team();
        t.add(1);
        t.add(3);
        t.add(5);
        t.add(6);
        assertEquals(Integer.valueOf(6), allTeams.bestSingleRemovedImprovement(t));
    }

    // === Search algorithms ===

    @Test
    @DisplayName("Local Search First from {0,5} finds {0,1,5}")
    void testLocalSearchFirst() {
        Team startT = new Team();
        startT.add(0);
        startT.add(5);
        Team expected = new Team();
        expected.add(0);
        expected.add(1);
        expected.add(5);
        assertEquals(expected, allTeams.localSearchFirst(startT));
    }

    @Test
    @DisplayName("Local Search Best from {0,5} finds {0,2,5,6}")
    void testLocalSearchBest() {
        Team startT = new Team();
        startT.add(0);
        startT.add(5);
        Team expected = new Team();
        expected.add(0);
        expected.add(2);
        expected.add(5);
        expected.add(6);
        assertEquals(expected, allTeams.localSearchBest(startT));
    }

    @Test
    @DisplayName("Guaranteed Best finds optimal {0,2,5,6}")
    void testGuaranteedBestTeam() {
        Team expected = new Team();
        expected.add(0);
        expected.add(2);
        expected.add(5);
        expected.add(6);
        assertEquals(expected, allTeams.guaranteedBestTeam());
    }

    @Test
    @DisplayName("Local Search Best from {0} is optimal")
    void testOptimalLocalSearchBestA() {
        Team tester = new Team();
        tester.add(0);
        assertTrue(allTeams.optimalLocalSearchBest(tester));
    }

    // === Step-by-step tracking ===

    @Test
    @DisplayName("Local Search First with steps starts and ends correctly")
    void testLocalSearchFirstWithSteps() {
        Team startT = new Team();
        startT.add(1);
        startT.add(3);
        startT.add(5);
        List<List<Integer>> steps = allTeams.localSearchFirstWithSteps(startT);

        // First step is the initial team
        assertEquals(List.of(1, 3, 5), steps.get(0));
        // Last step matches the final result of localSearchFirst
        assertEquals(List.of(0, 1, 5), steps.get(steps.size() - 1));
        // Should have more than 1 step (algorithm made moves)
        assertTrue(steps.size() > 1);
    }

    @Test
    @DisplayName("Local Search Best with steps starts and ends correctly")
    void testLocalSearchBestWithSteps() {
        Team startT = new Team();
        startT.add(0);
        startT.add(5);
        List<List<Integer>> steps = allTeams.localSearchBestWithSteps(startT);

        // First step is the initial team
        assertEquals(List.of(0, 5), steps.get(0));
        // Last step matches the final result of localSearchBest
        assertEquals(List.of(0, 2, 5, 6), steps.get(steps.size() - 1));
        assertTrue(steps.size() > 1);
    }

    @Test
    @DisplayName("Each step differs by exactly one player")
    void testStepsChangeBySinglePlayer() {
        Team startT = new Team();
        startT.add(0);
        startT.add(5);
        List<List<Integer>> steps = allTeams.localSearchBestWithSteps(startT);

        for (int i = 1; i < steps.size(); i++) {
            List<Integer> prev = steps.get(i - 1);
            List<Integer> curr = steps.get(i);
            // Count differences: exactly one player added or removed
            int added = 0, removed = 0;
            for (Integer p : curr) {
                if (!prev.contains(p)) added++;
            }
            for (Integer p : prev) {
                if (!curr.contains(p)) removed++;
            }
            assertTrue(
                (added == 1 && removed == 0) || (added == 0 && removed == 1),
                "Step " + i + " should change by exactly one player"
            );
        }
    }
}
