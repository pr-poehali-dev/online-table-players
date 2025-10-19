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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';
import { toast } from 'sonner';

interface Player {
  id: string;
  name: string;
  position: string;
  number: number;
}

interface Team {
  id: string;
  name: string;
  logo: string;
  points: number;
  played: number;
  wins: number;
  draws: number;
  losses: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  players: Player[];
}

interface Match {
  id: string;
  homeTeamId: string;
  awayTeamId: string;
  homeScore: number;
  awayScore: number;
  date: Date;
}

const Index = () => {
  const [teams, setTeams] = useState<Team[]>([
    {
      id: '1',
      name: 'Спартак',
      logo: '🔴',
      points: 15,
      played: 6,
      wins: 5,
      draws: 0,
      losses: 1,
      goalsFor: 12,
      goalsAgainst: 4,
      goalDifference: 8,
      players: [
        { id: 'p1', name: 'Иванов', position: 'ВРТ', number: 1 },
        { id: 'p2', name: 'Петров', position: 'ЗАЩ', number: 5 },
        { id: 'p3', name: 'Сидоров', position: 'ПОЛ', number: 10 },
        { id: 'p4', name: 'Смирнов', position: 'НАП', number: 9 },
      ],
    },
    {
      id: '2',
      name: 'ЦСКА',
      logo: '🔵',
      points: 12,
      played: 6,
      wins: 4,
      draws: 0,
      losses: 2,
      goalsFor: 10,
      goalsAgainst: 6,
      goalDifference: 4,
      players: [
        { id: 'p5', name: 'Кузнецов', position: 'ВРТ', number: 1 },
        { id: 'p6', name: 'Попов', position: 'ЗАЩ', number: 4 },
        { id: 'p7', name: 'Соколов', position: 'ПОЛ', number: 8 },
        { id: 'p8', name: 'Лебедев', position: 'НАП', number: 11 },
      ],
    },
    {
      id: '3',
      name: 'Зенит',
      logo: '⚪',
      points: 10,
      played: 6,
      wins: 3,
      draws: 1,
      losses: 2,
      goalsFor: 9,
      goalsAgainst: 7,
      goalDifference: 2,
      players: [
        { id: 'p9', name: 'Волков', position: 'ВРТ', number: 1 },
        { id: 'p10', name: 'Морозов', position: 'ЗАЩ', number: 3 },
        { id: 'p11', name: 'Новиков', position: 'ПОЛ', number: 7 },
        { id: 'p12', name: 'Федоров', position: 'НАП', number: 10 },
      ],
    },
    {
      id: '4',
      name: 'Локомотив',
      logo: '🟢',
      points: 7,
      played: 6,
      wins: 2,
      draws: 1,
      losses: 3,
      goalsFor: 6,
      goalsAgainst: 8,
      goalDifference: -2,
      players: [
        { id: 'p13', name: 'Егоров', position: 'ВРТ', number: 1 },
        { id: 'p14', name: 'Павлов', position: 'ЗАЩ', number: 2 },
        { id: 'p15', name: 'Семенов', position: 'ПОЛ', number: 6 },
        { id: 'p16', name: 'Григорьев', position: 'НАП', number: 9 },
      ],
    },
  ]);

  const [matches, setMatches] = useState<Match[]>([]);
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [newTeamName, setNewTeamName] = useState('');
  const [newTeamLogo, setNewTeamLogo] = useState('⚽');
  const [homeTeamId, setHomeTeamId] = useState('');
  const [awayTeamId, setAwayTeamId] = useState('');
  const [homeScore, setHomeScore] = useState('');
  const [awayScore, setAwayScore] = useState('');
  const [newPlayerName, setNewPlayerName] = useState('');
  const [newPlayerPosition, setNewPlayerPosition] = useState('');
  const [newPlayerNumber, setNewPlayerNumber] = useState('');
  const [isAddTeamOpen, setIsAddTeamOpen] = useState(false);
  const [isAddMatchOpen, setIsAddMatchOpen] = useState(false);
  const [isViewTeamOpen, setIsViewTeamOpen] = useState(false);

  const addTeam = () => {
    if (!newTeamName.trim()) {
      toast.error('Введите название команды');
      return;
    }

    const newTeam: Team = {
      id: Date.now().toString(),
      name: newTeamName,
      logo: newTeamLogo || '⚽',
      points: 0,
      played: 0,
      wins: 0,
      draws: 0,
      losses: 0,
      goalsFor: 0,
      goalsAgainst: 0,
      goalDifference: 0,
      players: [],
    };

    setTeams([...teams, newTeam]);
    setNewTeamName('');
    setNewTeamLogo('⚽');
    setIsAddTeamOpen(false);
    toast.success(`Команда ${newTeamName} добавлена`);
  };

  const addMatch = () => {
    if (!homeTeamId || !awayTeamId) {
      toast.error('Выберите обе команды');
      return;
    }

    if (homeTeamId === awayTeamId) {
      toast.error('Команды должны быть разными');
      return;
    }

    const home = parseInt(homeScore) || 0;
    const away = parseInt(awayScore) || 0;

    const updatedTeams = teams.map(team => {
      if (team.id === homeTeamId) {
        const isWin = home > away;
        const isDraw = home === away;
        return {
          ...team,
          played: team.played + 1,
          wins: team.wins + (isWin ? 1 : 0),
          draws: team.draws + (isDraw ? 1 : 0),
          losses: team.losses + (!isWin && !isDraw ? 1 : 0),
          points: team.points + (isWin ? 3 : isDraw ? 1 : 0),
          goalsFor: team.goalsFor + home,
          goalsAgainst: team.goalsAgainst + away,
          goalDifference: team.goalDifference + (home - away),
        };
      }
      if (team.id === awayTeamId) {
        const isWin = away > home;
        const isDraw = home === away;
        return {
          ...team,
          played: team.played + 1,
          wins: team.wins + (isWin ? 1 : 0),
          draws: team.draws + (isDraw ? 1 : 0),
          losses: team.losses + (!isWin && !isDraw ? 1 : 0),
          points: team.points + (isWin ? 3 : isDraw ? 1 : 0),
          goalsFor: team.goalsFor + away,
          goalsAgainst: team.goalsAgainst + home,
          goalDifference: team.goalDifference + (away - home),
        };
      }
      return team;
    });

    setTeams(updatedTeams);

    const newMatch: Match = {
      id: Date.now().toString(),
      homeTeamId,
      awayTeamId,
      homeScore: home,
      awayScore: away,
      date: new Date(),
    };

    setMatches([newMatch, ...matches]);
    setHomeTeamId('');
    setAwayTeamId('');
    setHomeScore('');
    setAwayScore('');
    setIsAddMatchOpen(false);
    toast.success('Результат матча добавлен');
  };

  const addPlayerToTeam = () => {
    if (!selectedTeam || !newPlayerName.trim() || !newPlayerPosition || !newPlayerNumber) {
      toast.error('Заполните все поля игрока');
      return;
    }

    const newPlayer: Player = {
      id: Date.now().toString(),
      name: newPlayerName,
      position: newPlayerPosition,
      number: parseInt(newPlayerNumber),
    };

    const updatedTeams = teams.map(team => {
      if (team.id === selectedTeam.id) {
        return {
          ...team,
          players: [...team.players, newPlayer],
        };
      }
      return team;
    });

    setTeams(updatedTeams);
    setSelectedTeam({ ...selectedTeam, players: [...selectedTeam.players, newPlayer] });
    setNewPlayerName('');
    setNewPlayerPosition('');
    setNewPlayerNumber('');
    toast.success(`Игрок ${newPlayer.name} добавлен`);
  };

  const viewTeam = (team: Team) => {
    setSelectedTeam(team);
    setIsViewTeamOpen(true);
  };

  const sortedTeams = [...teams].sort((a, b) => {
    if (b.points !== a.points) return b.points - a.points;
    if (b.goalDifference !== a.goalDifference) return b.goalDifference - a.goalDifference;
    return b.goalsFor - a.goalsFor;
  });

  const totalGames = teams.reduce((sum, t) => sum + t.played, 0) / 2;
  const totalGoals = teams.reduce((sum, t) => sum + t.goalsFor, 0);

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="text-center space-y-2 animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-bold text-primary flex items-center justify-center gap-3">
            <Icon name="Trophy" size={40} />
            Футбольная лига
          </h1>
          <p className="text-muted-foreground text-lg">
            Турнирная таблица • Составы команд • Результаты матчей
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-slide-up">
          <Card className="border-primary/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Icon name="Users" size={18} />
                Команд
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{teams.length}</div>
            </CardContent>
          </Card>

          <Card className="border-secondary/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Icon name="Flame" size={18} />
                Сыграно матчей
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{totalGames}</div>
            </CardContent>
          </Card>

          <Card className="border-accent/20">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Icon name="Zap" size={18} />
                Всего голов
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{totalGoals}</div>
            </CardContent>
          </Card>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <Dialog open={isAddTeamOpen} onOpenChange={setIsAddTeamOpen}>
            <DialogTrigger asChild>
              <Button className="flex-1 gap-2" size="lg">
                <Icon name="Plus" size={20} />
                Добавить команду
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Новая команда</DialogTitle>
                <DialogDescription>
                  Создайте команду и добавьте игроков
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="teamName">Название команды</Label>
                  <Input
                    id="teamName"
                    value={newTeamName}
                    onChange={(e) => setNewTeamName(e.target.value)}
                    placeholder="Введите название"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="teamLogo">Эмодзи (логотип)</Label>
                  <Input
                    id="teamLogo"
                    value={newTeamLogo}
                    onChange={(e) => setNewTeamLogo(e.target.value)}
                    placeholder="⚽"
                    maxLength={2}
                  />
                </div>
                <Button onClick={addTeam} className="w-full">
                  Создать команду
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={isAddMatchOpen} onOpenChange={setIsAddMatchOpen}>
            <DialogTrigger asChild>
              <Button className="flex-1 gap-2" size="lg" variant="secondary">
                <Icon name="Calendar" size={20} />
                Добавить результат
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Результат матча</DialogTitle>
                <DialogDescription>
                  Таблица обновится автоматически (3 очка за победу, 1 за ничью)
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label>Команда дома</Label>
                    <Select value={homeTeamId} onValueChange={setHomeTeamId}>
                      <SelectTrigger>
                        <SelectValue placeholder="Выбрать" />
                      </SelectTrigger>
                      <SelectContent>
                        {teams.map((team) => (
                          <SelectItem key={team.id} value={team.id}>
                            {team.logo} {team.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Команда в гостях</Label>
                    <Select value={awayTeamId} onValueChange={setAwayTeamId}>
                      <SelectTrigger>
                        <SelectValue placeholder="Выбрать" />
                      </SelectTrigger>
                      <SelectContent>
                        {teams.map((team) => (
                          <SelectItem key={team.id} value={team.id}>
                            {team.logo} {team.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label>Голы дома</Label>
                    <Input
                      type="number"
                      min="0"
                      value={homeScore}
                      onChange={(e) => setHomeScore(e.target.value)}
                      placeholder="0"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Голы в гостях</Label>
                    <Input
                      type="number"
                      min="0"
                      value={awayScore}
                      onChange={(e) => setAwayScore(e.target.value)}
                      placeholder="0"
                    />
                  </div>
                </div>

                <Button onClick={addMatch} className="w-full">
                  Сохранить результат
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <Tabs defaultValue="table" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="table" className="gap-2">
              <Icon name="Table" size={18} />
              Турнирная таблица
            </TabsTrigger>
            <TabsTrigger value="matches" className="gap-2">
              <Icon name="ListChecks" size={18} />
              Матчи
            </TabsTrigger>
          </TabsList>

          <TabsContent value="table">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Icon name="Trophy" size={24} />
                  Турнирная таблица
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left p-3 text-sm font-semibold text-muted-foreground">Место</th>
                        <th className="text-left p-3 text-sm font-semibold text-muted-foreground">Команда</th>
                        <th className="text-center p-3 text-sm font-semibold text-muted-foreground">И</th>
                        <th className="text-center p-3 text-sm font-semibold text-muted-foreground">В</th>
                        <th className="text-center p-3 text-sm font-semibold text-muted-foreground">Н</th>
                        <th className="text-center p-3 text-sm font-semibold text-muted-foreground">П</th>
                        <th className="text-center p-3 text-sm font-semibold text-muted-foreground">Мячи</th>
                        <th className="text-center p-3 text-sm font-semibold text-muted-foreground">Разница</th>
                        <th className="text-center p-3 text-sm font-semibold text-muted-foreground">Очки</th>
                        <th className="text-center p-3 text-sm font-semibold text-muted-foreground">Состав</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sortedTeams.map((team, index) => (
                        <tr
                          key={team.id}
                          className="border-b border-border/50 hover:bg-muted/50 transition-colors"
                        >
                          <td className="p-3">
                            <div className="flex items-center gap-2">
                              {index === 0 && <Icon name="Crown" className="text-yellow-500" size={18} />}
                              <span className="font-semibold text-lg">{index + 1}</span>
                            </div>
                          </td>
                          <td className="p-3">
                            <div className="flex items-center gap-2 font-medium">
                              <span className="text-2xl">{team.logo}</span>
                              {team.name}
                            </div>
                          </td>
                          <td className="p-3 text-center text-muted-foreground">{team.played}</td>
                          <td className="p-3 text-center text-green-500 font-semibold">{team.wins}</td>
                          <td className="p-3 text-center text-yellow-500 font-semibold">{team.draws}</td>
                          <td className="p-3 text-center text-red-500 font-semibold">{team.losses}</td>
                          <td className="p-3 text-center text-muted-foreground">
                            {team.goalsFor}:{team.goalsAgainst}
                          </td>
                          <td className="p-3 text-center">
                            <Badge variant={team.goalDifference > 0 ? 'default' : 'secondary'}>
                              {team.goalDifference > 0 ? '+' : ''}{team.goalDifference}
                            </Badge>
                          </td>
                          <td className="p-3 text-center">
                            <Badge className="font-mono text-lg px-3 py-1">
                              {team.points}
                            </Badge>
                          </td>
                          <td className="p-3 text-center">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => viewTeam(team)}
                              className="gap-1"
                            >
                              <Icon name="Users" size={16} />
                              {team.players.length}
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="matches">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Icon name="History" size={24} />
                  История матчей
                </CardTitle>
              </CardHeader>
              <CardContent>
                {matches.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    Пока нет сыгранных матчей
                  </div>
                ) : (
                  <div className="space-y-3">
                    {matches.map((match) => {
                      const homeTeam = teams.find(t => t.id === match.homeTeamId);
                      const awayTeam = teams.find(t => t.id === match.awayTeamId);
                      const isHomeWin = match.homeScore > match.awayScore;
                      const isDraw = match.homeScore === match.awayScore;
                      
                      return (
                        <div
                          key={match.id}
                          className="flex items-center justify-between p-4 rounded-lg bg-muted/30 border border-border/50"
                        >
                          <div className="flex items-center gap-4 flex-1">
                            <div className={`flex items-center gap-2 flex-1 ${isHomeWin ? 'font-bold' : ''}`}>
                              <span className="text-2xl">{homeTeam?.logo}</span>
                              <span>{homeTeam?.name}</span>
                            </div>
                            
                            <div className="flex items-center gap-3 px-4">
                              <Badge variant="outline" className="text-xl font-bold px-4 py-2">
                                {match.homeScore}
                              </Badge>
                              <span className="text-muted-foreground">-</span>
                              <Badge variant="outline" className="text-xl font-bold px-4 py-2">
                                {match.awayScore}
                              </Badge>
                            </div>

                            <div className={`flex items-center gap-2 flex-1 justify-end ${!isHomeWin && !isDraw ? 'font-bold' : ''}`}>
                              <span>{awayTeam?.name}</span>
                              <span className="text-2xl">{awayTeam?.logo}</span>
                            </div>
                          </div>

                          <div className="ml-4 text-sm text-muted-foreground">
                            {match.date.toLocaleDateString('ru-RU')}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <Dialog open={isViewTeamOpen} onOpenChange={setIsViewTeamOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-2xl">
                <span className="text-3xl">{selectedTeam?.logo}</span>
                {selectedTeam?.name}
              </DialogTitle>
              <DialogDescription>
                Состав команды • {selectedTeam?.players.length} игроков
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-3">
                <Input
                  placeholder="Имя игрока"
                  value={newPlayerName}
                  onChange={(e) => setNewPlayerName(e.target.value)}
                />
                <Select value={newPlayerPosition} onValueChange={setNewPlayerPosition}>
                  <SelectTrigger>
                    <SelectValue placeholder="Позиция" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ВРТ">Вратарь</SelectItem>
                    <SelectItem value="ЗАЩ">Защитник</SelectItem>
                    <SelectItem value="ПОЛ">Полузащитник</SelectItem>
                    <SelectItem value="НАП">Нападающий</SelectItem>
                  </SelectContent>
                </Select>
                <div className="flex gap-2">
                  <Input
                    type="number"
                    placeholder="№"
                    value={newPlayerNumber}
                    onChange={(e) => setNewPlayerNumber(e.target.value)}
                    min="1"
                    max="99"
                  />
                  <Button onClick={addPlayerToTeam} size="icon">
                    <Icon name="Plus" size={18} />
                  </Button>
                </div>
              </div>

              <div className="border rounded-lg overflow-hidden">
                <table className="w-full">
                  <thead className="bg-muted">
                    <tr>
                      <th className="text-left p-3 text-sm font-semibold">Номер</th>
                      <th className="text-left p-3 text-sm font-semibold">Игрок</th>
                      <th className="text-left p-3 text-sm font-semibold">Позиция</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedTeam?.players.sort((a, b) => a.number - b.number).map((player) => (
                      <tr key={player.id} className="border-t border-border">
                        <td className="p-3">
                          <Badge variant="outline" className="font-mono">
                            {player.number}
                          </Badge>
                        </td>
                        <td className="p-3 font-medium">{player.name}</td>
                        <td className="p-3 text-muted-foreground">{player.position}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default Index;
