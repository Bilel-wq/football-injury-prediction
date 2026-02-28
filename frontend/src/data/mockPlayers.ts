import type { Player } from '../types';

export const mockPlayers: Player[] = [
  { id: 1, name: "K. Mbappé", number: 10, position: "Attaquant", image_url: "https://ui-avatars.com/api/?name=Kylian+M&background=0D8ABC&color=fff&size=100", current_risk: 15 },
  { id: 2, name: "J. Bellingham", number: 5, position: "Milieu", image_url: "https://ui-avatars.com/api/?name=Jude+B&background=0D8ABC&color=fff&size=100", current_risk: 55 },
  { id: 3, name: "E. Militão", number: 3, position: "Défenseur", image_url: "https://ui-avatars.com/api/?name=Eder+M&background=0D8ABC&color=fff&size=100", current_risk: 85 },
  { id: 4, name: "Vinícius Jr.", number: 7, position: "Attaquant", image_url: "https://ui-avatars.com/api/?name=Vinicius+J&background=0D8ABC&color=fff&size=100", current_risk: 20 },
  { id: 5, name: "E. Camavinga", number: 12, position: "Milieu", image_url: "https://ui-avatars.com/api/?name=Eduardo+C&background=0D8ABC&color=fff&size=100", current_risk: 35 },
  { id: 6, name: "T. Courtois", number: 1, position: "Gardien", image_url: "https://ui-avatars.com/api/?name=Thibaut+C&background=0D8ABC&color=fff&size=100", current_risk: 5 },
  { id: 7, name: "D. Carvajal", number: 2, position: "Défenseur", image_url: "https://ui-avatars.com/api/?name=Dani+C&background=0D8ABC&color=fff&size=100", current_risk: 70 },
  { id: 8, name: "A. Tchouaméni", number: 8, position: "Milieu", image_url: "https://ui-avatars.com/api/?name=Aurelien+T&background=0D8ABC&color=fff&size=100", current_risk: 42 },
  { id: 9, name: "F. Valverde", number: 15, position: "Milieu", image_url: "https://ui-avatars.com/api/?name=Fede+V&background=0D8ABC&color=fff&size=100", current_risk: 28 },
  { id: 10, name: "L. Modric", number: 10, position: "Milieu", image_url: "https://ui-avatars.com/api/?name=Luka+M&background=0D8ABC&color=fff&size=100", current_risk: 60 },
  { id: 11, name: "T. Kroos", number: 8, position: "Milieu", image_url: "https://ui-avatars.com/api/?name=Toni+K&background=0D8ABC&color=fff&size=100", current_risk: 45 },
  { id: 12, name: "R. Benzema", number: 9, position: "Attaquant", image_url: "https://ui-avatars.com/api/?name=Karim+B&background=0D8ABC&color=fff&size=100", current_risk: 75 },
  { id: 13, name: "A. Rüdiger", number: 22, position: "Défenseur", image_url: "https://ui-avatars.com/api/?name=Antonio+R&background=0D8ABC&color=fff&size=100", current_risk: 18 },
  { id: 14, name: "N. Nacho", number: 6, position: "Défenseur", image_url: "https://ui-avatars.com/api/?name=Nacho+F&background=0D8ABC&color=fff&size=100", current_risk: 88 },
  { id: 15, name: "L. Vázquez", number: 17, position: "Attaquant", image_url: "https://ui-avatars.com/api/?name=Lucas+V&background=0D8ABC&color=fff&size=100", current_risk: 32 },
  { id: 16, name: "M. Asensio", number: 11, position: "Milieu", image_url: "https://ui-avatars.com/api/?name=Marco+A&background=0D8ABC&color=fff&size=100", current_risk: 50 },
  { id: 17, name: "D. Ceballos", number: 19, position: "Milieu", image_url: "https://ui-avatars.com/api/?name=Dani+Ce&background=0D8ABC&color=fff&size=100", current_risk: 65 },
  { id: 18, name: "M. Diaz", number: 21, position: "Milieu", image_url: "https://ui-avatars.com/api/?name=Brahim+D&background=0D8ABC&color=fff&size=100", current_risk: 22 },
  { id: 19, name: "B. Lunin", number: 13, position: "Gardien", image_url: "https://ui-avatars.com/api/?name=Andriy+L&background=0D8ABC&color=fff&size=100", current_risk: 8 },
  { id: 20, name: "J. Morcillo", number: 24, position: "Attaquant", image_url: "https://ui-avatars.com/api/?name=Joselu+M&background=0D8ABC&color=fff&size=100", current_risk: 40 },
  { id: 21, name: "N. Güler", number: 26, position: "Milieu", image_url: "https://ui-avatars.com/api/?name=Arda+G&background=0D8ABC&color=fff&size=100", current_risk: 78 },
  { id: 22, name: "P. Arda", number: 25, position: "Attaquant", image_url: "https://ui-avatars.com/api/?name=Pedro+A&background=0D8ABC&color=fff&size=100", current_risk: 25 },
  { id: 23, name: "F. Garcia", number: 16, position: "Défenseur", image_url: "https://ui-avatars.com/api/?name=Ferland+M&background=0D8ABC&color=fff&size=100", current_risk: 92 },
  { id: 24, name: "A. Mendy", number: 23, position: "Défenseur", image_url: "https://ui-avatars.com/api/?name=Ferland+M&background=0D8ABC&color=fff&size=100", current_risk: 38 },
  { id: 25, name: "D. Alaba", number: 4, position: "Défenseur", image_url: "https://ui-avatars.com/api/?name=David+A&background=0D8ABC&color=fff&size=100", current_risk: 55 },
  { id: 26, name: "M. Fran García", number: 20, position: "Défenseur", image_url: "https://ui-avatars.com/api/?name=Fran+G&background=0D8ABC&color=fff&size=100", current_risk: 12 },
];

export function getStatus(risk: number): { color: string; bgColor: string; label: string } {
  if (risk < 30) return { color: '#22c55e', bgColor: 'bg-risk-green', label: 'Optimal' };
  if (risk < 60) return { color: '#eab308', bgColor: 'bg-risk-yellow', label: 'À surveiller' };
  return { color: '#ef4444', bgColor: 'bg-risk-red', label: 'Risque critique' };
}
