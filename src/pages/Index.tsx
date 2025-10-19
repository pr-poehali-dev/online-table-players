import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { toast } from 'sonner';

interface Player {
  id: string;
  name: string;
  rating: number;
  wins: number;
  losses: number;
  winRate: number;
  gamesPlayed: number;
}

interface Match {
  id: string;
  winnerId: string;
  loserId: string;
  date: Date;
}

const Index = () => {
  const [players, setPlayers] = useState<Player[]>([
    { id: '1', name: 'Player One', rating: 1500, wins: 15, losses: 5, winRate: 75, gamesPlayed: 20 },
    { id: '2', name: 'Player Two', rating: 1450, wins: 12, losses: 8, winRate: 60, gamesPlayed: 20 },
    { id: '3', name: 'Player Three', rating: 1400, wins: 10, losses: 10, winRate: 50, gamesPlayed: 20 },
    { id: '4', name: 'Player Four', rating: 1350, wins: 8, losses: 12, winRate: 40, gamesPlayed: 20 },
    { id: '5', name: 'Player Five', rating: 1300, wins: 5, losses: 15, winRate: 25, gamesPlayed: 20 },
  ]);

  const [matches, setMatches] = useState<Match[]>([]);
  const [newPlayerName, setNewPlayerName] = useState('');
  const [selectedWinner, setSelectedWinner] = useState('');
  const [selectedLoser, setSelectedLoser] = useState('');
  const [isAddPlayerOpen, setIsAddPlayerOpen] = useState(false);
  const [isAddMatchOpen, setIsAddMatchOpen] = useState(false);

  const calculateNewRating = (currentRating: number, opponentRating: number, won: boolean) => {
    const K = 32;
    const expectedScore = 1 / (1 + Math.pow(10, (opponentRating - currentRating) / 400));
    const actualScore = won ? 1 : 0;
    return Math.round(currentRating + K * (actualScore - expectedScore));
  };

  const addPlayer = () => {
    if (!newPlayerName.trim()) {
      toast.error('Введите имя игрока');
      return;
    }

    const newPlayer: Player = {
      id: Date.now().toString(),
      name: newPlayerName,
      rating: 1200,
      wins: 0,
      losses: 0,
      winRate: 0,
      gamesPlayed: 0,
    };

    setPlayers([...players, newPlayer]);
    setNewPlayerName('');
    setIsAddPlayerOpen(false);
    toast.success(`Игрок ${newPlayerName} добавлен`);
  };

  const addMatch = () => {
    if (!selectedWinner || !selectedLoser) {
      toast.error('Выберите победителя и проигравшего');
      return;
    }

    if (selectedWinner === selectedLoser) {
      toast.error('Победитель и проигравший не могут быть одним игроком');
      return;
    }

    const winner = players.find(p => p.id === selectedWinner);
    const loser = players.find(p => p.id === selectedLoser);

    if (!winner || !loser) return;

    const newWinnerRating = calculateNewRating(winner.rating, loser.rating, true);
    const newLoserRating = calculateNewRating(loser.rating, winner.rating, false);

    const updatedPlayers = players.map(player => {
      if (player.id === selectedWinner) {
        const newWins = player.wins + 1;
        const newGamesPlayed = player.gamesPlayed + 1;
        return {
          ...player,
          rating: newWinnerRating,
          wins: newWins,
          gamesPlayed: newGamesPlayed,
          winRate: Math.round((newWins / newGamesPlayed) * 100),
        };
      }
      if (player.id === selectedLoser) {
        const newLosses = player.losses + 1;
        const newGamesPlayed = player.gamesPlayed + 1;
        return {
          ...player,
          rating: newLoserRating,
          losses: newLosses,
          gamesPlayed: newGamesPlayed,
          winRate: Math.round((player.wins / newGamesPlayed) * 100),
        };
      }
      return player;
    });

    setPlayers(updatedPlayers);

    const newMatch: Match = {
      id: Date.now().toString(),
      winnerId: selectedWinner,
      loserId: selectedLoser,
      date: new Date(),
    };

    setMatches([newMatch, ...matches]);
    setSelectedWinner('');
    setSelectedLoser('');
    setIsAddMatchOpen(false);
    toast.success('Результат матча добавлен, рейтинг обновлён');
  };

  const sortedPlayers = [...players].sort((a, b) => b.rating - a.rating);

  const getRankIcon = (index: number) => {
    if (index === 0) return <Icon name="Trophy" className="text-yellow-500" size={20} />;
    if (index === 1) return <Icon name="Medal" className="text-gray-400" size={20} />;
    if (index === 2) return <Icon name="Award" className="text-amber-700" size={20} />;
    return null;
  };

  const totalGames = players.reduce((sum, p) => sum + p.gamesPlayed, 0);
  const avgRating = players.length > 0 
    ? Math.round(players.reduce((sum, p) => sum + p.rating, 0) / players.length)
    : 0;

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="text-center space-y-2 animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-bold text-primary">
            Турнирная система
          </h1>
          <p className="text-muted-foreground text-lg">
            Автоматический подсчёт рейтинга • Статистика игроков
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-slide-up">
          <Card className="border-primary/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Icon name="Users" size={18} />
                Игроков
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{players.length}</div>
            </CardContent>
          </Card>

          <Card className="border-secondary/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Icon name="Target" size={18} />
                Всего игр
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{totalGames}</div>
            </CardContent>
          </Card>

          <Card className="border-accent/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Icon name="TrendingUp" size={18} />
                Средний рейтинг
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{avgRating}</div>
            </CardContent>
          </Card>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <Dialog open={isAddPlayerOpen} onOpenChange={setIsAddPlayerOpen}>
            <DialogTrigger asChild>
              <Button className="flex-1 gap-2" size="lg">
                <Icon name="UserPlus" size={20} />
                Добавить игрока
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Новый игрок</DialogTitle>
                <DialogDescription>
                  Начальный рейтинг: 1200
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="playerName">Имя игрока</Label>
                  <Input
                    id="playerName"
                    value={newPlayerName}
                    onChange={(e) => setNewPlayerName(e.target.value)}
                    placeholder="Введите имя"
                    onKeyDown={(e) => e.key === 'Enter' && addPlayer()}
                  />
                </div>
                <Button onClick={addPlayer} className="w-full">
                  Добавить
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={isAddMatchOpen} onOpenChange={setIsAddMatchOpen}>
            <DialogTrigger asChild>
              <Button className="flex-1 gap-2" size="lg" variant="secondary">
                <Icon name="Swords" size={20} />
                Добавить результат
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Результат матча</DialogTitle>
                <DialogDescription>
                  Рейтинг обновится автоматически по системе Эло
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Победитель</Label>
                  <Select value={selectedWinner} onValueChange={setSelectedWinner}>
                    <SelectTrigger>
                      <SelectValue placeholder="Выберите игрока" />
                    </SelectTrigger>
                    <SelectContent>
                      {players.map((player) => (
                        <SelectItem key={player.id} value={player.id}>
                          {player.name} (Рейтинг: {player.rating})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Проигравший</Label>
                  <Select value={selectedLoser} onValueChange={setSelectedLoser}>
                    <SelectTrigger>
                      <SelectValue placeholder="Выберите игрока" />
                    </SelectTrigger>
                    <SelectContent>
                      {players.map((player) => (
                        <SelectItem key={player.id} value={player.id}>
                          {player.name} (Рейтинг: {player.rating})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Button onClick={addMatch} className="w-full">
                  Сохранить результат
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Icon name="Trophy" size={24} />
              Таблица лидеров
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left p-3 text-sm font-semibold text-muted-foreground">Место</th>
                    <th className="text-left p-3 text-sm font-semibold text-muted-foreground">Игрок</th>
                    <th className="text-right p-3 text-sm font-semibold text-muted-foreground">Рейтинг</th>
                    <th className="text-right p-3 text-sm font-semibold text-muted-foreground">Игр</th>
                    <th className="text-right p-3 text-sm font-semibold text-muted-foreground">Побед</th>
                    <th className="text-right p-3 text-sm font-semibold text-muted-foreground">Поражений</th>
                    <th className="text-right p-3 text-sm font-semibold text-muted-foreground">Процент побед</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedPlayers.map((player, index) => (
                    <tr
                      key={player.id}
                      className="border-b border-border/50 hover:bg-muted/50 transition-colors"
                    >
                      <td className="p-3">
                        <div className="flex items-center gap-2">
                          {getRankIcon(index)}
                          <span className="font-semibold text-lg">{index + 1}</span>
                        </div>
                      </td>
                      <td className="p-3 font-medium">{player.name}</td>
                      <td className="p-3 text-right">
                        <Badge variant="outline" className="font-mono text-base border-primary/40">
                          {player.rating}
                        </Badge>
                      </td>
                      <td className="p-3 text-right text-muted-foreground">{player.gamesPlayed}</td>
                      <td className="p-3 text-right">
                        <span className="text-green-500 font-semibold">{player.wins}</span>
                      </td>
                      <td className="p-3 text-right">
                        <span className="text-red-500 font-semibold">{player.losses}</span>
                      </td>
                      <td className="p-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-primary to-secondary transition-all"
                              style={{ width: `${player.winRate}%` }}
                            />
                          </div>
                          <span className="font-semibold w-12 text-right">{player.winRate}%</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {matches.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Icon name="History" size={24} />
                История матчей
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {matches.slice(0, 10).map((match) => {
                  const winner = players.find(p => p.id === match.winnerId);
                  const loser = players.find(p => p.id === match.loserId);
                  return (
                    <div
                      key={match.id}
                      className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-border/50"
                    >
                      <div className="flex items-center gap-3">
                        <Icon name="CheckCircle2" className="text-green-500" size={20} />
                        <span className="font-medium">{winner?.name}</span>
                        <Icon name="Swords" className="text-muted-foreground" size={16} />
                        <span className="text-muted-foreground">{loser?.name}</span>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {match.date.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Index;
