// Serviço simples para acessar a API da NASA - Para trabalho escolar
const NASA_API_KEY = '8iF0jRSN54cnJRx5i8hHcfVZwRhJySTF5dcihq7v';

class NasaService {
  
  // Busca a foto astronômica do dia
  async getFotoAstronomicaDoDia(data = null) {
    try {
      let url = `https://api.nasa.gov/planetary/apod?api_key=${NASA_API_KEY}`;
      if (data) {
        url += `&date=${data}`;
      }
      
      const response = await fetch(url);
      const responseData = await response.json();
      return responseData;
    } catch (error) {
      console.error('Erro ao buscar foto do dia:', error);
      return null;
    }
  }

  // Busca fotos de Marte (limitado para simplicidade)
  async getFotosDeMarte() {
    try {
      const response = await fetch(
        `https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos?sol=1000&api_key=${NASA_API_KEY}`
      );
      const data = await response.json();
      // Retorna apenas 8 fotos para não sobrecarregar
      return data.photos ? data.photos.slice(0, 8) : [];
    } catch (error) {
      console.error('Erro ao buscar fotos de Marte:', error);
      return [];
    }
  }
}

export default new NasaService();