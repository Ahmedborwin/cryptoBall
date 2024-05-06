const playerMetaData = [
  {
    player_id: 1,
    name: "Player 1",
    positions: "Goalkeeper",
    overall_rating: 97,
    potential: 75,
    value: 1000000,
    Attack: 84,
    Midfield: 64,
    Defense: 94,
    Goalkeeping: 90,
  },
  {
    player_id: 2,
    name: "Player 2",
    positions: "Defender",
    overall_rating: 100,
    potential: 76,
    value: 35000000,
    Attack: 83,
    Midfield: 88,
    Defense: 60,
    Goalkeeping: 9,
  },
  {
    player_id: 3,
    name: "Player 3",
    positions: "Defender",
    overall_rating: 61,
    potential: 65,
    value: 13000000,
    Attack: 81,
    Midfield: 66,
    Defense: 81,
    Goalkeeping: 7,
  },
  {
    player_id: 4,
    name: "Player 4",
    positions: "Defender",
    overall_rating: 67,
    potential: 84,
    value: 84000000,
    Attack: 88,
    Midfield: 84,
    Defense: 82,
    Goalkeeping: 1,
  },
  {
    player_id: 5,
    name: "Player 5",
    positions: "Goalkeeper",
    overall_rating: 82,
    potential: 97,
    value: 49000000,
    Attack: 96,
    Midfield: 68,
    Defense: 52,
    Goalkeeping: 76,
  },
  {
    player_id: 6,
    name: "Player 6",
    positions: "Goalkeeper",
    overall_rating: 77,
    potential: 72,
    value: 13000000,
    Attack: 76,
    Midfield: 81,
    Defense: 59,
    Goalkeeping: 50,
  },
  {
    player_id: 7,
    name: "Player 7",
    positions: "Forward",
    overall_rating: 96,
    potential: 78,
    value: 65000000,
    Attack: 69,
    Midfield: 98,
    Defense: 86,
    Goalkeeping: 7,
  },
  {
    player_id: 8,
    name: "Player 8",
    positions: "Forward",
    overall_rating: 92,
    potential: 97,
    value: 63000000,
    Attack: 69,
    Midfield: 55,
    Defense: 52,
    Goalkeeping: 1,
  },
  {
    player_id: 9,
    name: "Player 9",
    positions: "Midfielder",
    overall_rating: 92,
    potential: 87,
    value: 16000000,
    Attack: 58,
    Midfield: 93,
    Defense: 70,
    Goalkeeping: 7,
  },
  {
    player_id: 10,
    name: "Player 10",
    positions: "Goalkeeper",
    overall_rating: 66,
    potential: 75,
    value: 78000000,
    Attack: 52,
    Midfield: 83,
    Defense: 99,
    Goalkeeping: 73,
  },
  {
    player_id: 11,
    name: "Player 11",
    positions: "Midfielder",
    overall_rating: 88,
    potential: 66,
    value: 95000000,
    Attack: 51,
    Midfield: 89,
    Defense: 77,
    Goalkeeping: 4,
  },
  {
    player_id: 12,
    name: "Player 12",
    positions: "Midfielder",
    overall_rating: 77,
    potential: 97,
    value: 58000000,
    Attack: 71,
    Midfield: 99,
    Defense: 64,
    Goalkeeping: 6,
  },
  {
    player_id: 13,
    name: "Player 13",
    positions: "Goalkeeper",
    overall_rating: 64,
    potential: 98,
    value: 6000000,
    Attack: 97,
    Midfield: 93,
    Defense: 89,
    Goalkeeping: 94,
  },
  {
    player_id: 14,
    name: "Player 14",
    positions: "Forward",
    overall_rating: 64,
    potential: 77,
    value: 29000000,
    Attack: 68,
    Midfield: 98,
    Defense: 52,
    Goalkeeping: 5,
  },
  {
    player_id: 15,
    name: "Player 15",
    positions: "Defender",
    overall_rating: 63,
    potential: 66,
    value: 71000000,
    Attack: 93,
    Midfield: 96,
    Defense: 76,
    Goalkeeping: 3,
  },
  {
    player_id: 16,
    name: "Player 16",
    positions: "Midfielder",
    overall_rating: 97,
    potential: 77,
    value: 11000000,
    Attack: 72,
    Midfield: 60,
    Defense: 56,
    Goalkeeping: 3,
  },
  {
    player_id: 17,
    name: "Player 17",
    positions: "Goalkeeper",
    overall_rating: 81,
    potential: 73,
    value: 52000000,
    Attack: 89,
    Midfield: 72,
    Defense: 86,
    Goalkeeping: 74,
  },
  {
    player_id: 18,
    name: "Player 18",
    positions: "Defender",
    overall_rating: 65,
    potential: 88,
    value: 100000000,
    Attack: 74,
    Midfield: 72,
    Defense: 91,
    Goalkeeping: 5,
  },
  {
    player_id: 19,
    name: "Player 19",
    positions: "Forward",
    overall_rating: 65,
    potential: 97,
    value: 82000000,
    Attack: 80,
    Midfield: 70,
    Defense: 88,
    Goalkeeping: 9,
  },
  {
    player_id: 20,
    name: "Player 20",
    positions: "Forward",
    overall_rating: 85,
    potential: 87,
    value: 41000000,
    Attack: 55,
    Midfield: 79,
    Defense: 62,
    Goalkeeping: 10,
  },
  {
    player_id: 21,
    name: "Player 21",
    positions: "Goalkeeper",
    overall_rating: 62,
    potential: 100,
    value: 54000000,
    Attack: 56,
    Midfield: 80,
    Defense: 68,
    Goalkeeping: 88,
  },
  {
    player_id: 22,
    name: "Player 22",
    positions: "Midfielder",
    overall_rating: 74,
    potential: 79,
    value: 66000000,
    Attack: 91,
    Midfield: 56,
    Defense: 50,
    Goalkeeping: 7,
  },
  {
    player_id: 23,
    name: "Player 23",
    positions: "Defender",
    overall_rating: 70,
    potential: 76,
    value: 15000000,
    Attack: 80,
    Midfield: 82,
    Defense: 57,
    Goalkeeping: 4,
  },
  {
    player_id: 24,
    name: "Player 24",
    positions: "Midfielder",
    overall_rating: 98,
    potential: 94,
    value: 42000000,
    Attack: 55,
    Midfield: 72,
    Defense: 66,
    Goalkeeping: 2,
  },
  {
    player_id: 25,
    name: "Player 25",
    positions: "Goalkeeper",
    overall_rating: 89,
    potential: 72,
    value: 93000000,
    Attack: 93,
    Midfield: 80,
    Defense: 98,
    Goalkeeping: 63,
  },
  {
    player_id: 26,
    name: "Player 26",
    positions: "Defender",
    overall_rating: 76,
    potential: 67,
    value: 54000000,
    Attack: 60,
    Midfield: 58,
    Defense: 92,
    Goalkeeping: 9,
  },
  {
    player_id: 27,
    name: "Player 27",
    positions: "Defender",
    overall_rating: 79,
    potential: 90,
    value: 34000000,
    Attack: 87,
    Midfield: 56,
    Defense: 94,
    Goalkeeping: 6,
  },
  {
    player_id: 28,
    name: "Player 28",
    positions: "Goalkeeper",
    overall_rating: 98,
    potential: 94,
    value: 13000000,
    Attack: 66,
    Midfield: 64,
    Defense: 64,
    Goalkeeping: 66,
  },
  {
    player_id: 29,
    name: "Player 29",
    positions: "Midfielder",
    overall_rating: 78,
    potential: 81,
    value: 50000000,
    Attack: 96,
    Midfield: 58,
    Defense: 70,
    Goalkeeping: 4,
  },
  {
    player_id: 30,
    name: "Player 30",
    positions: "Midfielder",
    overall_rating: 68,
    potential: 80,
    value: 67000000,
    Attack: 87,
    Midfield: 95,
    Defense: 57,
    Goalkeeping: 1,
  },
  {
    player_id: 31,
    name: "Player 31",
    positions: "Midfielder",
    overall_rating: 94,
    potential: 92,
    value: 22000000,
    Attack: 50,
    Midfield: 93,
    Defense: 88,
    Goalkeeping: 3,
  },
  {
    player_id: 32,
    name: "Player 32",
    positions: "Goalkeeper",
    overall_rating: 85,
    potential: 77,
    value: 23000000,
    Attack: 55,
    Midfield: 96,
    Defense: 56,
    Goalkeeping: 93,
  },
  {
    player_id: 33,
    name: "Player 33",
    positions: "Goalkeeper",
    overall_rating: 79,
    potential: 82,
    value: 29000000,
    Attack: 82,
    Midfield: 97,
    Defense: 79,
    Goalkeeping: 95,
  },
  {
    player_id: 34,
    name: "Player 34",
    positions: "Defender",
    overall_rating: 65,
    potential: 73,
    value: 4000000,
    Attack: 69,
    Midfield: 72,
    Defense: 87,
    Goalkeeping: 6,
  },
  {
    player_id: 35,
    name: "Player 35",
    positions: "Defender",
    overall_rating: 67,
    potential: 69,
    value: 47000000,
    Attack: 75,
    Midfield: 71,
    Defense: 93,
    Goalkeeping: 5,
  },
  {
    player_id: 36,
    name: "Player 36",
    positions: "Midfielder",
    overall_rating: 92,
    potential: 65,
    value: 3000000,
    Attack: 69,
    Midfield: 93,
    Defense: 91,
    Goalkeeping: 9,
  },
  {
    player_id: 37,
    name: "Player 37",
    positions: "Midfielder",
    overall_rating: 99,
    potential: 71,
    value: 11000000,
    Attack: 75,
    Midfield: 66,
    Defense: 95,
    Goalkeeping: 4,
  },
  {
    player_id: 38,
    name: "Player 38",
    positions: "Goalkeeper",
    overall_rating: 63,
    potential: 92,
    value: 36000000,
    Attack: 99,
    Midfield: 81,
    Defense: 82,
    Goalkeeping: 55,
  },
  {
    player_id: 39,
    name: "Player 39",
    positions: "Goalkeeper",
    overall_rating: 87,
    potential: 60,
    value: 80000000,
    Attack: 82,
    Midfield: 63,
    Defense: 77,
    Goalkeeping: 80,
  },
  {
    player_id: 40,
    name: "Player 40",
    positions: "Goalkeeper",
    overall_rating: 78,
    potential: 89,
    value: 8000000,
    Attack: 96,
    Midfield: 50,
    Defense: 64,
    Goalkeeping: 58,
  },
  {
    player_id: 41,
    name: "Player 41",
    positions: "Midfielder",
    overall_rating: 90,
    potential: 86,
    value: 79000000,
    Attack: 54,
    Midfield: 92,
    Defense: 62,
    Goalkeeping: 7,
  },
  {
    player_id: 42,
    name: "Player 42",
    positions: "Defender",
    overall_rating: 93,
    potential: 77,
    value: 88000000,
    Attack: 85,
    Midfield: 68,
    Defense: 78,
    Goalkeeping: 5,
  },
  {
    player_id: 43,
    name: "Player 43",
    positions: "Forward",
    overall_rating: 89,
    potential: 82,
    value: 79000000,
    Attack: 65,
    Midfield: 75,
    Defense: 81,
    Goalkeeping: 2,
  },
  {
    player_id: 44,
    name: "Player 44",
    positions: "Defender",
    overall_rating: 68,
    potential: 82,
    value: 63000000,
    Attack: 68,
    Midfield: 67,
    Defense: 76,
    Goalkeeping: 8,
  },
  {
    player_id: 45,
    name: "Player 45",
    positions: "Midfielder",
    overall_rating: 83,
    potential: 83,
    value: 42000000,
    Attack: 83,
    Midfield: 71,
    Defense: 56,
    Goalkeeping: 10,
  },
  {
    player_id: 46,
    name: "Player 46",
    positions: "Forward",
    overall_rating: 64,
    potential: 91,
    value: 89000000,
    Attack: 63,
    Midfield: 92,
    Defense: 86,
    Goalkeeping: 1,
  },
  {
    player_id: 47,
    name: "Player 47",
    positions: "Forward",
    overall_rating: 94,
    potential: 91,
    value: 33000000,
    Attack: 81,
    Midfield: 70,
    Defense: 51,
    Goalkeeping: 1,
  },
  {
    player_id: 48,
    name: "Player 48",
    positions: "Defender",
    overall_rating: 63,
    potential: 84,
    value: 27000000,
    Attack: 75,
    Midfield: 52,
    Defense: 51,
    Goalkeeping: 9,
  },
  {
    player_id: 49,
    name: "Player 49",
    positions: "Goalkeeper",
    overall_rating: 77,
    potential: 81,
    value: 15000000,
    Attack: 82,
    Midfield: 66,
    Defense: 87,
    Goalkeeping: 72,
  },
  {
    player_id: 50,
    name: "Player 50",
    positions: "Forward",
    overall_rating: 100,
    potential: 76,
    value: 33000000,
    Attack: 74,
    Midfield: 96,
    Defense: 75,
    Goalkeeping: 6,
  },
  {
    player_id: 51,
    name: "Player 51",
    positions: "Midfielder",
    overall_rating: 77,
    potential: 60,
    value: 43000000,
    Attack: 84,
    Midfield: 97,
    Defense: 69,
    Goalkeeping: 5,
  },
  {
    player_id: 52,
    name: "Player 52",
    positions: "Goalkeeper",
    overall_rating: 97,
    potential: 71,
    value: 85000000,
    Attack: 56,
    Midfield: 63,
    Defense: 55,
    Goalkeeping: 95,
  },
  {
    player_id: 53,
    name: "Player 53",
    positions: "Defender",
    overall_rating: 82,
    potential: 94,
    value: 1000000,
    Attack: 86,
    Midfield: 59,
    Defense: 63,
    Goalkeeping: 1,
  },
  {
    player_id: 54,
    name: "Player 54",
    positions: "Defender",
    overall_rating: 78,
    potential: 94,
    value: 12000000,
    Attack: 80,
    Midfield: 59,
    Defense: 91,
    Goalkeeping: 3,
  },
  {
    player_id: 55,
    name: "Player 55",
    positions: "Goalkeeper",
    overall_rating: 86,
    potential: 99,
    value: 48000000,
    Attack: 83,
    Midfield: 98,
    Defense: 71,
    Goalkeeping: 54,
  },
  {
    player_id: 56,
    name: "Player 56",
    positions: "Forward",
    overall_rating: 87,
    potential: 92,
    value: 37000000,
    Attack: 95,
    Midfield: 72,
    Defense: 69,
    Goalkeeping: 6,
  },
  {
    player_id: 57,
    name: "Player 57",
    positions: "Midfielder",
    overall_rating: 72,
    potential: 76,
    value: 40000000,
    Attack: 84,
    Midfield: 56,
    Defense: 63,
    Goalkeeping: 4,
  },
  {
    player_id: 58,
    name: "Player 58",
    positions: "Forward",
    overall_rating: 98,
    potential: 62,
    value: 61000000,
    Attack: 62,
    Midfield: 76,
    Defense: 96,
    Goalkeeping: 2,
  },
  {
    player_id: 59,
    name: "Player 59",
    positions: "Defender",
    overall_rating: 74,
    potential: 97,
    value: 1000000,
    Attack: 68,
    Midfield: 82,
    Defense: 71,
    Goalkeeping: 10,
  },
  {
    player_id: 60,
    name: "Player 60",
    positions: "Defender",
    overall_rating: 71,
    potential: 70,
    value: 3000000,
    Attack: 92,
    Midfield: 54,
    Defense: 74,
    Goalkeeping: 9,
  },
]

module.exports = {
  playerMetaData,
}