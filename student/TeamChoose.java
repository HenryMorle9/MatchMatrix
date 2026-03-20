package student;

import java.io.BufferedReader;
import java.io.FileReader;
import java.io.IOException;
import java.util.Iterator;
import java.util.Map;
import java.util.TreeMap;
import java.util.Vector;


import java.util.Set;
import java.util.Arrays;
import java.util.Collections;

//the graph representing everything
public class TeamChoose {

	// Data members
	
	// TODO: add data members (class variables)
	Map <Integer, PastPlayDeets> playerGraph;
	private Iterator<Map.Entry<Integer, PastPlayDeets>> gIt;

	private Team bestTeamFound;
private Double bestTeamScore;
	
	// Provided functions
	
	public Vector<DataRow> readWeightedFromFile(String fInName) throws IOException {
		// Reads list of past player interactions from a file, one per line 
		BufferedReader fIn = new BufferedReader(
							 new FileReader(fInName));
		String s;
		Vector<DataRow> listOfDataRows = new Vector<DataRow>();
		Integer x, y;
		Double w;
		
		while ((s = fIn.readLine()) != null) {
			java.util.StringTokenizer line = new java.util.StringTokenizer(s);
			while (line.hasMoreTokens()) {
				x = Integer.parseInt(line.nextToken());
				y = Integer.parseInt(line.nextToken());
				w = Double.parseDouble(line.nextToken());
				System.out.println("x: " + x + " y: " + y + " w: " + w);
				listOfDataRows.add(new DataRow(x,y,w));
			}
		}
		fIn.close();
		
		return listOfDataRows;
	}


	// TODO: complete functions below
	
	// PASS
	
	public TeamChoose() {
		// Constructor
		this.playerGraph = new TreeMap<Integer, PastPlayDeets>();
		// TODO
	}

	public void setPlayerGraph(Vector<DataRow> dataList) { //done and marked
		// PRE: -
		// POST: Has initialised appropriate data members with
		//           the graph defined by dataList
		playerGraph.clear();
		for(DataRow listVal: dataList) {
			Integer player1 = listVal.getFirst();
			Integer player2 = listVal.getSecond();
			Double score = listVal.getScore();
			
			playerGraph.putIfAbsent(player1, new PastPlayDeets());
			playerGraph.putIfAbsent(player2, new PastPlayDeets());
			
			playerGraph.get(player1).insertPlayerScore(player2, score);
			playerGraph.get(player2).insertPlayerScore(player1, score);
		}
		// TODO
	}
	
	public PastPlayDeets getPlayerDetails(Integer p1) { //done and marked
		// PRE: p1 is a valid player ID
		// POST: Returns the past player details for player p1
		// TODO
		if(playerGraph.containsKey(p1)) {
			PastPlayDeets returnValue = playerGraph.get(p1);
			return returnValue;
		}
		return null;
	}
	
	public Integer hasPlayedWithLowestID(Integer p1) { //done and marked
		// PRE: p1 is a valid player ID
		// POST: Returns, out of all the players p1 has previously played with,
		//           the player with the lowest ID
		// TODO
		if(playerGraph.containsKey(p1)) {
			PastPlayDeets playerDetails = getPlayerDetails(p1);
			return playerDetails.hasPlayedWithLowestID(); 
		}		
		return null;
	}
	
	public Team hasPlayedWithAll(Integer p1) { //done and marked
		// PRE: p1 is a valid player ID
		// POST: Returns all of the players p1 has played with, as a Team
		// TODO
		if(playerGraph.containsKey(p1)) {
			Team allPlayerTeam = new Team();
			PastPlayDeets playerDetails = getPlayerDetails(p1);
			Set<Integer> allPlayerIds = playerDetails.listPastPlayers();
			allPlayerTeam.addAll(allPlayerIds);
			return allPlayerTeam;
		}		
		return null;
	}
	
public Double scoreBetween(Integer p1, Integer p2) {
    // PRE: p1 and p2 are valid player IDs
    // POST: Returns score from past plays between p1 and p2

    if (!playerGraph.containsKey(p1) || !playerGraph.containsKey(p2)) {
        return 0.0;
    }
    return playerGraph.get(p1).getPlayerScore(p2);
}
	
	public Double singlePlayerTeamScore(Integer p1) { //done and marked
		// PRE: p1 is a valid player ID
		// POST: Returns the score of p1 being on a team by himself/herself

		// TODO
		if(playerGraph.containsKey(p1)) {
			PastPlayDeets p1Deets = getPlayerDetails(p1);
			return p1Deets.getPlayerScoreTota();
		}
		return null;
	}

	public Team otherTeam(Team pTeam) { //done and marked
		// PRE: -
		// POST: Returns as a team all players not in pTeam
		Team returnTeam = new Team();
		Set<Integer> playIDSet = null;
		playIDSet = playerGraph.keySet();
		
		for(Integer teamVal: playIDSet) {
			if(!pTeam.contains(teamVal)) {
				returnTeam.add(teamVal);
			}
		}
		return returnTeam;

		// TODO
	}
	
	public Double multiPlayerTeamScore(Team pTeam) { //done and marked
		// PRE: -
		// POST: Returns the score of pTeam comprising one team 
		//           and the remaining players comprising the other team

		// TODO
		Team mainTeam = pTeam;
		Team otherTeam = otherTeam(pTeam);
		Double score = 0.0;
		
		for(Integer otherTeamVal: otherTeam) {
			for(Integer mainTeamVal: mainTeam) {
			score += scoreBetween(mainTeamVal, otherTeamVal);
			}
		}
		
		
		return score;
	}

	public Integer lowestIDOnTeam(Team pTeam) {
		// PRE: pTeam contains one or more valid player IDs
		// POST: Returns the lowest numbered player ID on pTeam
		
		// TODO
		Integer returnVal = Collections.min(pTeam);
		return returnVal;
	}
	
	public Team allPlayerTeam() {
		// PRE: -
		// POST: Returns all players as a single team
		Team finalTeam = new Team();
		Set<Integer> teamSet = playerGraph.keySet();
		finalTeam.addAll(teamSet);
		// TODO
		
		return finalTeam;
	}

	public Team testWithLowestID(Team pTeam) { //done and tested
		// PRE: -
		// POST: Returns the team (i.e., either pTeam or the other player team) that has the lowest numbered player
		Team otherTeam = otherTeam(pTeam);
		Team mainTeam = pTeam;

		if (mainTeam.isEmpty()) {
			return otherTeam;
		}
		if (otherTeam.isEmpty()) {
			return mainTeam;
		}
		
		if(Collections.min(otherTeam) < Collections.min(mainTeam)) {
			return otherTeam;
		} else {
			return mainTeam;
		}
		
		// TODO
	}
	
	
public Boolean isBetter(Team pTeam, Integer p1) {
    // PRE: p1 is a valid player ID
    // POST: If p1 is in pTeam, returns true if score of pTeam would be higher without p1,
    //       false otherwise;
    //       otherwise returns true if score of pTeam would be higher with p1,
    //       false otherwise;

    Team modified = new Team();
    modified.addAll(pTeam);

    Double originalScore = multiPlayerTeamScore(pTeam);

    if (modified.contains(p1)) {
        modified.remove(p1);
    } else {
        modified.add(p1);
    }

    Double newScore = multiPlayerTeamScore(modified);

    return newScore > originalScore;
}
	
	public Integer firstSingleAddedImprovement(Team pTeam) { //done and marked
		// PRE: -
		// POST: If pTeam can be improved by adding any single player p1 not in pTeam,
		// return the first (lowest ID) p1 that leads an improvement
		// otherwise (i.e., if pTeam cannot be improved by adding any players),
		// return null

		// TODO
		Team allTeam = allPlayerTeam();
		Iterator<Integer> teamIt = allTeam.iterator();
		while (teamIt.hasNext()) {
			Integer teamVal = teamIt.next();

			if (!pTeam.contains(teamVal)) {
				if (isBetter(pTeam, teamVal)) {
					return teamVal;
				}
			}
		}

		return null;
	}

	public Integer firstSingleRemovedImprovement(Team pTeam) {
		// PRE: pTeam contains one or more valid player IDs
		// POST: If pTeam can be improved by removing any single player p1 in pTeam,
		//                return the first p1 that leads to an improvement
		//       otherwise (i.e., if pTeam cannot be improved by removing any players),
		//                return null
		
		// TODO
		Iterator<Integer> teamIt = pTeam.iterator();
		
		while (teamIt.hasNext()) {
			Integer teamVal = teamIt.next();
			
				if (isBetter(pTeam, teamVal)) {
					return teamVal;
				}
		
	}
		return null;
	}

	// CREDIT / DISTINCTION
	

public Team localSearchFirst(Team initTeam) {
    Team currentTeam = new Team();
    currentTeam.addAll(initTeam);

    boolean improved;

    do {
        improved = false;

        Integer playerToAdd = firstSingleAddedImprovement(currentTeam);
        if (playerToAdd != null) {
            currentTeam.add(playerToAdd);
            improved = true;
        }

        Integer playerToRemove = firstSingleRemovedImprovement(currentTeam);
        if (playerToRemove != null) {
            currentTeam.remove(playerToRemove);
            improved = true;
        }

    } while (improved);

    return currentTeam;
}

public Integer bestSingleAddedImprovement(Team pTeam) {
    Integer bestPlayer = null;
    Double bestImprovement = 0.0;
    Double currentScore = multiPlayerTeamScore(pTeam);

    for (Integer player : allPlayerTeam()) {
        if (!pTeam.contains(player)) {
            Team testTeam = new Team();
            testTeam.addAll(pTeam);
            testTeam.add(player);

            Double improvement = multiPlayerTeamScore(testTeam) - currentScore;

            if (improvement > bestImprovement) {
                bestImprovement = improvement;
                bestPlayer = player;
            } else if (improvement > 0.0 && improvement.equals(bestImprovement)
                    && (bestPlayer == null || player < bestPlayer)) {
                bestPlayer = player;
            }
        }
    }

    return bestPlayer;
}

public Integer bestSingleRemovedImprovement(Team pTeam) {
    Integer bestPlayer = null;
    Double bestImprovement = 0.0;
    Double currentScore = multiPlayerTeamScore(pTeam);

    for (Integer player : pTeam) {
        Team testTeam = new Team();
        testTeam.addAll(pTeam);
        testTeam.remove(player);

        Double improvement = multiPlayerTeamScore(testTeam) - currentScore;

        if (improvement > bestImprovement) {
            bestImprovement = improvement;
            bestPlayer = player;
        } else if (improvement > 0.0 && improvement.equals(bestImprovement)
                && (bestPlayer == null || player < bestPlayer)) {
            bestPlayer = player;
        }
    }

    return bestPlayer;
}


public Team localSearchBest(Team initTeam) {
    Team currentTeam = new Team();
    currentTeam.addAll(initTeam);

    boolean improved;

    do {
        improved = false;

        Integer playerToAdd = bestSingleAddedImprovement(currentTeam);
        if (playerToAdd != null) {
            currentTeam.add(playerToAdd);
            improved = true;
        }

        Integer playerToRemove = bestSingleRemovedImprovement(currentTeam);
        if (playerToRemove != null) {
            currentTeam.remove(playerToRemove);
            improved = true;
        }

    } while (improved);

    return currentTeam;
}
	
	// (HIGH) DISTINCTION

private Integer lowestOverallPlayerID() {
    return Collections.min(playerGraph.keySet());
}

private Team canonicalTeam(Team pTeam) {
    Team chosenTeam = testWithLowestID(pTeam);
    Team canonical = new Team();
    canonical.addAll(chosenTeam);
    return canonical;
}

private void searchBestTeam(Vector<Integer> players, int index, Team currentTeam) {
    if (index == players.size()) {
        Integer lowestPlayer = lowestOverallPlayerID();
        if (!currentTeam.contains(lowestPlayer)) {
            return;
        }

        Double score = multiPlayerTeamScore(currentTeam);

        if (bestTeamFound == null || score > bestTeamScore) {
            bestTeamScore = score;
            bestTeamFound = canonicalTeam(currentTeam);
        }
        return;
    }

    Integer player = players.get(index);

    currentTeam.add(player);
    searchBestTeam(players, index + 1, currentTeam);

    currentTeam.remove(player);
    searchBestTeam(players, index + 1, currentTeam);
}

public Team guaranteedBestTeam() {
    Vector<Integer> players = new Vector<Integer>();
    players.addAll(allPlayerTeam());

    bestTeamFound = null;
    bestTeamScore = Double.NEGATIVE_INFINITY;

    Team currentTeam = new Team();
    searchBestTeam(players, 0, currentTeam);

    return bestTeamFound;
}
	
public Boolean optimalLocalSearchBest(Team t) {
    Team localResult = localSearchBest(t);
    Team localNormalized = canonicalTeam(localResult);

    Team bestResult = guaranteedBestTeam();

    return localNormalized.equals(bestResult);
}
	
	
	public static void main(String[] args) {

		TeamChoose allTeams = new TeamChoose();
		Vector<DataRow> listOfDataRows;
		
		try {
			Team s;
			listOfDataRows = allTeams.readWeightedFromFile("C:/Users/henry/eclipse-workspace-2010-round-2/FPSMatch2022Framework/Assignment-2-sample-data.txt");
		}
		catch (IOException e) {
			System.out.println("in exception: " + e);
		}
		
	}

}
