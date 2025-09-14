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
} from 'react-native';
import NasaService from '../services/NasaService';

const { width } = Dimensions.get('window');

const MarteScreen = () => {
  const [fotos, setFotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fotoSelecionada, setFotoSelecionada] = useState(null);

  useEffect(() => {
    carregarFotosMarte();
  }, []);

  const carregarFotosMarte = async () => {
    try {
      setLoading(true);
      const data = await NasaService.getFotosDeMarte();
      setFotos(data);
      if (data.length > 0) {
        setFotoSelecionada(data[0]);
      }
    } catch (error) {
      console.error('Erro ao carregar fotos de Marte:', error);
      Alert.alert('Erro', 'Não foi possível carregar as fotos de Marte');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FF69B4" />
          <Text style={styles.loadingText}>Explorando Marte...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>🔴 Explorando Marte</Text>
          <Text style={styles.subtitle}>Fotos do Rover Curiosity</Text>
        </View>

        {/* Foto Principal */}
        {fotoSelecionada && (
          <View style={styles.mainImageContainer}>
            <Image 
              source={{ uri: fotoSelecionada.img_src }} 
              style={styles.mainImage}
              resizeMode="cover"
            />
            <View style={styles.imageInfo}>
              <Text style={styles.cameraName}>
                📷 {fotoSelecionada.camera.full_name}
              </Text>
              <Text style={styles.imageDate}>
                📅 {new Date(fotoSelecionada.earth_date).toLocaleDateString('pt-BR')}
              </Text>
              <Text style={styles.solInfo}>
                🌞 Sol {fotoSelecionada.sol} (dia marciano)
              </Text>
            </View>
          </View>
        )}

        {/* Informações sobre Marte */}
        <View style={styles.infoContainer}>
          <Text style={styles.infoTitle}>🚀 Sobre o Rover Curiosity</Text>
          <Text style={styles.infoText}>
            O Curiosity está explorando Marte desde 2012! Ele é como um laboratório 
            científico com rodas, tirando fotos incríveis e estudando o solo marciano.
          </Text>
        </View>

        {/* Galeria de fotos */}
        <View style={styles.galleryContainer}>
          <Text style={styles.galleryTitle}>📸 Mais fotos de Marte:</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {fotos.map((foto) => (
              <TouchableOpacity
                key={foto.id}
                style={[
                  styles.thumbnail,
                  fotoSelecionada?.id === foto.id && styles.selectedThumbnail
                ]}
                onPress={() => setFotoSelecionada(foto)}
              >
                <Image 
                  source={{ uri: foto.img_src }} 
                  style={styles.thumbnailImage}
                />
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Curiosidades sobre Marte */}
        <View style={styles.factsContainer}>
          <Text style={styles.factsTitle}>🌟 Curiosidades sobre Marte</Text>
          
          <View style={styles.factItem}>
            <Text style={styles.factEmoji}>🔴</Text>
            <Text style={styles.factText}>
              É chamado de "planeta vermelho" por causa do ferro oxidado em sua superfície
            </Text>
          </View>

          <View style={styles.factItem}>
            <Text style={styles.factEmoji}>❄️</Text>
            <Text style={styles.factText}>
              Tem calotas polares feitas de gelo de água e gelo seco
            </Text>
          </View>

          <View style={styles.factItem}>
            <Text style={styles.factEmoji}>⏰</Text>
            <Text style={styles.factText}>
              Um dia em Marte dura 24h e 37min, quase igual à Terra!
            </Text>
          </View>

          <View style={styles.factItem}>
            <Text style={styles.factEmoji}>🏔️</Text>
            <Text style={styles.factText}>
              Tem o maior vulcão do Sistema Solar: Olympus Mons
            </Text>
          </View>

          <View style={styles.factItem}>
            <Text style={styles.factEmoji}>🌡️</Text>
            <Text style={styles.factText}>
              A temperatura pode chegar a -80°C no inverno!
            </Text>
          </View>
        </View>

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
    color: '#FFFFFF',
    fontSize: 16,
    marginTop: 10,
    fontWeight: 'bold',
  },
  header: {
    padding: 20,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#FFFFFF',
    opacity: 0.9,
  },
  mainImageContainer: {
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 15,
    overflow: 'hidden',
    backgroundColor: '#FFFFFF',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  mainImage: {
    width: '100%',
    height: width * 0.6,
  },
  imageInfo: {
    padding: 15,
    backgroundColor: '#FFF0F5',
  },
  cameraName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FF69B4',
    marginBottom: 5,
  },
  imageDate: {
    fontSize: 14,
    color: '#FF69B4',
    marginBottom: 5,
  },
  solInfo: {
    fontSize: 14,
    color: '#FF69B4',
  },
  infoContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 15,
    padding: 20,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FF69B4',
    marginBottom: 10,
  },
  infoText: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
    textAlign: 'justify',
  },
  galleryContainer: {
    marginBottom: 20,
  },
  galleryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 15,
    marginHorizontal: 20,
  },
  thumbnail: {
    marginLeft: 20,
    borderRadius: 10,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedThumbnail: {
    borderColor: '#FFFFFF',
  },
  thumbnailImage: {
    width: 80,
    height: 80,
  },
  factsContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    marginHorizontal: 20,
    marginBottom: 30,
    borderRadius: 15,
    padding: 20,
  },
  factsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FF69B4',
    marginBottom: 15,
    textAlign: 'center',
  },
  factItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  factEmoji: {
    fontSize: 20,
    marginRight: 12,
    marginTop: 2,
  },
  factText: {
    flex: 1,
    fontSize: 15,
    color: '#333',
    lineHeight: 22,
  },
});

export default MarteScreen;