import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  ActivityIndicator,
  Pressable,
  Linking,
  Platform,
  Dimensions,
  StatusBar,
  Modal,
  ScrollView,
} from 'react-native';
import axios from 'axios';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');
const CARD_MARGIN = 16;
const CARD_WIDTH = (width - CARD_MARGIN * 3) / 2;
const STATUS_BAR_HEIGHT = Platform.OS === 'web' ? 0 : StatusBar.currentHeight || 44;

interface GameResult {
  prizeAmount: number;
  oddsOfWinning: string;
  prizesRemaining: number;
  prizesPaid: number;
  prizeRemainingPercent: string;
}

interface Game {
  _id: string;
  state: string;
  name: string;
  number: string;
  date: string;
  gameResults: GameResult[];
  gameImage: string;
  luckyAlgoScore: number;
  rate: number;
  overallOdds: number;
}

const api = axios.create({
  baseURL: 'https://api.luckyalgo.com',
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  },
});

export default function LotteryGames() {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [state, setState] = useState('NY');
  const [isGridView, setIsGridView] = useState(true);
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);

  useEffect(() => {
    fetchGames();
  }, [state]);

  const fetchGames = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get(`/api/games/result/getRankingByState/${state}/100/0`);
      const processedGames = response.data.map((game: Game) => ({
        ...game,
        gameImage: state === 'FL' 
          ? `https://www.flalottery.com/${game.gameImage}`
          : game.gameImage
      }));
      const sortedGames = processedGames.sort((a: Game, b: Game) => b.luckyAlgoScore - a.luckyAlgoScore);
      setGames(sortedGames);
    } catch (err) {
      console.error('Error fetching games:', err);
      setError('Unable to load games. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const openGameLink = (game: Game) => {
    const baseUrl = state === 'NY' 
      ? 'https://nylottery.ny.gov/scratch-off-game?game='
      : 'https://floridalottery.com/games/scratch-offs/view?id=';
    
    const url = `${baseUrl}${game.number}`;
    Linking.openURL(url);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const renderListItem = ({ item }: { item: Game }) => (
    <Pressable
      style={styles.listCard}
      onPress={() => setSelectedGame(item)}>
      <Image
        source={{ uri: item.gameImage }}
        style={styles.listImage}
        resizeMode="cover"
      />
      <View style={styles.listContent}>
        <View style={styles.gameInfo}>
          <Text style={styles.listGameName} numberOfLines={1}>{item.name}</Text>
          <Text style={styles.gameNumber}>#{item.number}</Text>
        </View>
        <View style={[
          styles.scoreContainer,
          { backgroundColor: item.luckyAlgoScore > 0 ? '#E8F5E9' : '#FFEBEE' }
        ]}>
          <Text style={[
            styles.scoreText,
            { color: item.luckyAlgoScore > 0 ? '#2E7D32' : '#C62828' }
          ]}>
            {item.luckyAlgoScore.toFixed(2)}
          </Text>
          <Text style={styles.scoreLabel}>Lucky Score</Text>
        </View>
      </View>
    </Pressable>
  );

  const renderGameModal = () => {
    if (!selectedGame) return null;

    return (
      <Modal
        visible={true}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setSelectedGame(null)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <ScrollView style={styles.modalScroll}>
              <Image
                source={{ uri: selectedGame.gameImage }}
                style={styles.modalImage}
                resizeMode="cover"
              />
              <View style={styles.modalHeader}>
                <View style={{flex: 1, paddingRight: 16}}>
                  <Text style={styles.modalTitle} numberOfLines={2}>{selectedGame.name}</Text>
                  <Text style={styles.modalSubtitle}>#{selectedGame.number}</Text>
                </View>
                <Pressable
                  style={styles.closeButton}
                  onPress={() => setSelectedGame(null)}>
                  <Ionicons name="close" size={24} color="#fff" />
                </Pressable>
              </View>

              <View style={styles.statsGrid}>
                <View style={styles.statCard}>
                  <Text style={[
                    styles.statValue,
                    { color: selectedGame.luckyAlgoScore > 0 ? '#2E7D32' : '#C62828' }
                  ]}>
                    {selectedGame.luckyAlgoScore.toFixed(2)}
                  </Text>
                  <Text style={styles.statLabel}>Lucky Score</Text>
                </View>
                <View style={styles.statCard}>
                  <Text style={styles.statValue}>{formatCurrency(selectedGame.rate)}</Text>
                  <Text style={styles.statLabel}>Rate</Text>
                </View>
                <View style={styles.statCard}>
                  <Text style={styles.statValue}>1:{selectedGame.overallOdds}</Text>
                  <Text style={styles.statLabel}>Overall Odds</Text>
                </View>
              </View>

              <Text style={styles.sectionTitle}>Prize Breakdown</Text>
              {selectedGame.gameResults.map((result, index) => (
                <View key={index} style={styles.prizeCard}>
                  <View style={styles.prizeHeader}>
                    <Text style={styles.prizeAmount}>
                      {formatCurrency(result.prizeAmount)}
                    </Text>
                    <Text style={styles.prizeOdds}>{result.oddsOfWinning}</Text>
                  </View>
                  
                  <View style={styles.prizeProgressBar}>
                    <View 
                      style={[
                        styles.prizeProgress,
                        { width: `${parseFloat(result.prizeRemainingPercent)}%` }
                      ]}
                    />
                  </View>
                  
                  <View style={styles.prizeStats}>
                    <Text style={styles.prizeStatText}>
                      {result.prizesRemaining.toLocaleString()} remaining
                    </Text>
                    <Text style={styles.prizeStatText}>
                      {result.prizesPaid.toLocaleString()} paid
                    </Text>
                  </View>
                </View>
              ))}

              <Pressable
                style={styles.viewButton}
                onPress={() => openGameLink(selectedGame)}>
                <Text style={styles.viewButtonText}>View Official Page</Text>
                <Ionicons name="open-outline" size={20} color="#fff" />
              </Pressable>
            </ScrollView>
          </View>
        </View>
      </Modal>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={[styles.header, { paddingTop: STATUS_BAR_HEIGHT + 16 }]}>
        <View style={styles.headerTop}>
          <View style={styles.stateSelector}>
            <Pressable
              style={[styles.stateButton, state === 'NY' && styles.stateButtonActive]}
              onPress={() => setState('NY')}>
              <Text style={[styles.stateText, state === 'NY' && styles.stateTextActive]}>
                NY
              </Text>
            </Pressable>
            <Pressable
              style={[styles.stateButton, state === 'FL' && styles.stateButtonActive]}
              onPress={() => setState('FL')}>
              <Text style={[styles.stateText, state === 'FL' && styles.stateTextActive]}>
                FL
              </Text>
            </Pressable>
          </View>
          
          <Pressable
            style={styles.viewToggle}
            onPress={() => setIsGridView(!isGridView)}>
            <Ionicons 
              name={isGridView ? "list" : "grid"}
              size={24}
              color="#fff"
            />
          </Pressable>
        </View>
      </View>

      {error ? (
        <View style={styles.centerContainer}>
          <Ionicons name="alert-circle" size={48} color="#C62828" />
          <Text style={styles.errorText}>{error}</Text>
          <Pressable style={styles.retryButton} onPress={fetchGames}>
            <Text style={styles.retryButtonText}>Try Again</Text>
          </Pressable>
        </View>
      ) : loading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#2196F3" />
          <Text style={styles.loadingText}>Loading games...</Text>
        </View>
      ) : (
        <FlatList
          data={games}
          renderItem={renderListItem}
          keyExtractor={item => item._id}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        />
      )}

      {renderGameModal()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    padding: 16,
    paddingTop: 0,
    backgroundColor: '#1a1a1a',
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  stateSelector: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 4,
    borderRadius: 12,
  },
  stateButton: {
    paddingVertical: 8,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  stateButtonActive: {
    backgroundColor: '#2196F3',
  },
  stateText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#999',
  },
  stateTextActive: {
    color: '#fff',
  },
  viewToggle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#757575',
  },
  errorText: {
    marginTop: 16,
    fontSize: 16,
    color: '#757575',
    textAlign: 'center',
  },
  retryButton: {
    marginTop: 24,
    backgroundColor: '#2196F3',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  list: {
    padding: 16,
  },
  listCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    flexDirection: 'row',
  },
  listImage: {
    width: 120,
    height: 120,
  },
  listContent: {
    flex: 1,
    padding: 12,
    justifyContent: 'space-between',
  },
  listGameName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#212121',
    marginBottom: 4,
  },
  gameInfo: {
    marginBottom: 8,
  },
  gameNumber: {
    fontSize: 14,
    color: '#757575',
  },
  scoreContainer: {
    padding: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  scoreText: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 2,
  },
  scoreLabel: {
    fontSize: 12,
    color: '#757575',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    height: '90%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 5,
  },
  modalScroll: {
    flex: 1,
  },
  modalImage: {
    width: '100%',
    height: width * 0.8,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: 16,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#212121',
    marginBottom: 4,
  },
  modalSubtitle: {
    fontSize: 16,
    color: '#757575',
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  statsGrid: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#F5F5F5',
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#fff',
    borderRadius: 12,
    marginHorizontal: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#212121',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#757575',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#212121',
    padding: 16,
    paddingBottom: 8,
  },
  prizeCard: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginBottom: 12,
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  prizeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  prizeAmount: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2196F3',
  },
  prizeOdds: {
    fontSize: 14,
    color: '#757575',
  },
  prizeProgressBar: {
    height: 8,
    backgroundColor: '#F5F5F5',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  prizeProgress: {
    height: '100%',
    backgroundColor: '#4CAF50',
    opacity: 0.3,
  },
  prizeStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  prizeStatText: {
    fontSize: 12,
    color: '#757575',
  },
  viewButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2196F3',
    margin: 16,
    padding: 16,
    borderRadius: 12,
    gap: 8,
  },
  viewButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});