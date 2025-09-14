import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Image,
  ActivityIndicator,
  Dimensions,
  TouchableOpacity,
  Alert,
  Linking,
} from 'react-native';
import NasaService from '../services/NasaService';

const { width } = Dimensions.get('window');

const FotoDoDiaScreen = () => {
  const [fotoData, setFotoData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    carregarFotoDoDia();
  }, []);

  const carregarFotoDoDia = async () => {
    try {
      setLoading(true);
      const data = await NasaService.getFotoAstronomicaDoDia();
      console.log('Dados da APOD:', data); // Para debug
      console.log('Media type:', data.media_type); // Debug específico do tipo
      console.log('URL:', data.url); // Debug da URL
      console.log('HD URL:', data.hdurl); // Debug da HD URL
      setFotoData(data);
    } catch (error) {
      console.error('Erro ao carregar foto:', error);
      Alert.alert('Erro', 'Não foi possível carregar a foto do dia');
    } finally {
      setLoading(false);
    }
  };

  const abrirVideo = async () => {
    Alert.alert(
      '🎥 Abrir Vídeo da NASA',
      'Isso abrirá o vídeo no YouTube. Deseja continuar?',
      [
        {
          text: 'Cancelar',
          style: 'cancel'
        },
        {
          text: '▶️ Assistir',
          onPress: async () => {
            try {
              const url = fotoData.url;
              console.log('Abrindo vídeo:', url);
              
              const supported = await Linking.canOpenURL(url);
              
              if (supported) {
                await Linking.openURL(url);
              } else {
                Alert.alert(
                  'Erro',
                  'Não foi possível abrir o vídeo. Verifique se você tem um navegador ou app do YouTube instalado.',
                  [{ text: 'OK' }]
                );
              }
            } catch (error) {
              console.error('Erro ao abrir vídeo:', error);
              Alert.alert(
                'Erro',
                'Não foi possível abrir o vídeo. Tente novamente mais tarde.',
                [{ text: 'OK' }]
              );
            }
          }
        }
      ]
    );
  };

  const carregarFotoDeOutroDia = async () => {
    try {
      setLoading(true);
      // Carrega foto de ontem
      const ontem = new Date();
      ontem.setDate(ontem.getDate() - 1);
      const dataOntem = ontem.toISOString().split('T')[0];
      
      const data = await NasaService.getFotoAstronomicaDoDia(dataOntem);
      console.log('Dados da APOD de ontem:', data);
      setFotoData(data);
    } catch (error) {
      console.error('Erro ao carregar foto de ontem:', error);
      Alert.alert('Erro', 'Não foi possível carregar a foto de ontem');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FF69B4" />
          <Text style={styles.loadingText}>Carregando foto do dia...</Text>
        </View>
      </View>
    );
  }

  if (!fotoData) {
    return (
      <View style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Ops! Não conseguimos carregar a foto</Text>
          <TouchableOpacity style={styles.retryButton} onPress={carregarFotoDoDia}>
            <Text style={styles.retryButtonText}>Tentar Novamente</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>🌟 Foto Astronômica do Dia</Text>
          <Text style={styles.date}>
            {new Date(fotoData.date).toLocaleDateString('pt-BR')}
          </Text>
        </View>

        {/* Imagem */}
        <View style={styles.imageContainer}>
          {fotoData.media_type === 'video' ? (
            <View style={styles.videoPlaceholder}>
              <Text style={styles.videoEmoji}>🎥</Text>
              <Text style={styles.videoText}>Vídeo do dia!</Text>
              <Text style={styles.videoSubText}>
                Hoje a NASA compartilhou um vídeo especial.{'\n'}
                Toque para assistir no YouTube!
              </Text>
              <TouchableOpacity 
                style={styles.videoButton}
                onPress={abrirVideo}
              >
                <Text style={styles.videoButtonText}>▶️ Assistir Vídeo</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <Image 
              source={{ uri: fotoData.hdurl || fotoData.url }} 
              style={styles.image}
              resizeMode="cover"
              onError={(error) => {
                console.log('Erro ao carregar imagem:', error);
                console.log('Tentando carregar:', fotoData.hdurl || fotoData.url);
              }}
              onLoad={() => console.log('Imagem carregada com sucesso!')}
            />
          )}
        </View>

        {/* Título */}
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{fotoData.title}</Text>
        </View>

        {/* Explicação */}
        <View style={styles.explanationContainer}>
          <Text style={styles.explanationTitle}>📖 O que estamos vendo?</Text>
          <Text style={styles.explanationText}>{fotoData.explanation}</Text>
        </View>

        {/* Curiosidade */}
        <View style={styles.funFactContainer}>
          <Text style={styles.funFactTitle}>💡 Você sabia?</Text>
          <Text style={styles.funFactText}>
            A NASA publica uma nova foto astronômica todos os dias desde 1995! 
            Cada imagem nos ajuda a entender melhor o universo.
          </Text>
        </View>

        {/* Botão para tentar outro dia se for vídeo */}
        {fotoData.media_type === 'video' && (
          <View style={styles.alternativeContainer}>
            <Text style={styles.alternativeTitle}>🖼️ Quer ver uma foto?</Text>
            <Text style={styles.alternativeText}>
              Hoje temos um vídeo, mas você pode ver a foto de ontem!
            </Text>
            <TouchableOpacity 
              style={styles.alternativeButton}
              onPress={() => carregarFotoDeOutroDia()}
            >
              <Text style={styles.alternativeButtonText}>📸 Ver Foto de Ontem</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Copyright */}
        {fotoData.copyright && (
          <View style={styles.copyrightContainer}>
            <Text style={styles.copyrightText}>
              📷 Créditos: {fotoData.copyright}
            </Text>
          </View>
        )}

      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFE4E1',
  },
  scrollView: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#FF69B4',
    fontSize: 16,
    marginTop: 10,
    fontWeight: 'bold',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    color: '#FF69B4',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#FF69B4',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  header: {
    padding: 20,
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 3,
    borderBottomColor: '#FF69B4',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FF69B4',
    textAlign: 'center',
    marginBottom: 8,
  },
  date: {
    fontSize: 16,
    color: '#666',
    fontWeight: '600',
  },
  imageContainer: {
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 15,
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
    elevation: 8,
    shadowColor: '#FF69B4',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    borderWidth: 2,
    borderColor: '#FFB6C1',
  },
  image: {
    width: '100%',
    height: width * 0.7,
  },
  videoPlaceholder: {
    width: '100%',
    height: width * 0.7,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF0F5',
  },
  videoEmoji: {
    fontSize: 50,
    marginBottom: 10,
  },
  videoText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FF69B4',
    marginBottom: 5,
  },
  videoSubText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 15,
  },
  videoButton: {
    backgroundColor: '#FF69B4',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  videoButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  alternativeContainer: {
    backgroundColor: '#FFF0F5',
    marginHorizontal: 20,
    marginTop: 15,
    borderRadius: 15,
    padding: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    borderWidth: 2,
    borderColor: '#FFB6C1',
    alignItems: 'center',
  },
  alternativeTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FF69B4',
    marginBottom: 8,
  },
  alternativeText: {
    fontSize: 15,
    color: '#333',
    textAlign: 'center',
    marginBottom: 15,
    lineHeight: 20,
  },
  alternativeButton: {
    backgroundColor: '#FF69B4',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  alternativeButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  titleContainer: {
    padding: 20,
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginTop: 15,
    borderRadius: 15,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    borderLeftWidth: 4,
    borderLeftColor: '#FF69B4',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    lineHeight: 28,
  },
  explanationContainer: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginTop: 15,
    borderRadius: 15,
    padding: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    borderLeftWidth: 4,
    borderLeftColor: '#FFB6C1',
  },
  explanationTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FF69B4',
    marginBottom: 12,
  },
  explanationText: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
    textAlign: 'justify',
  },
  funFactContainer: {
    backgroundColor: '#FFF0F5',
    marginHorizontal: 20,
    marginTop: 15,
    borderRadius: 15,
    padding: 20,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    borderWidth: 2,
    borderColor: '#FFB6C1',
  },
  funFactTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FF69B4',
    marginBottom: 12,
  },
  funFactText: {
    fontSize: 15,
    color: '#333',
    lineHeight: 22,
    textAlign: 'justify',
  },
  copyrightContainer: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    marginBottom: 20,
  },
  copyrightText: {
    color: '#666',
    fontSize: 14,
    textAlign: 'center',
    fontStyle: 'italic',
  },
});

export default FotoDoDiaScreen;