// Tests pour la configuration du jeu
describe('Configuration du Jeu', function() {
    
    this.it('devrait avoir les dimensions correctes', () => {
        expect(GameConfig.width).toBe(800);
        expect(GameConfig.height).toBe(600);
        return true;
    });
    
    this.it('devrait avoir une couleur de fond définie', () => {
        expect(GameConfig.backgroundColor).toBe('#000011');
        return true;
    });
    
    this.it('devrait avoir les paramètres du joueur corrects', () => {
        expect(GameConfig.player.speed).toBe(200);
        expect(GameConfig.player.lives).toBe(3);
        expect(GameConfig.player.fireRate).toBe(150);
        return true;
    });
    
    this.it('devrait avoir les paramètres des ennemis', () => {
        expect(GameConfig.enemies.speed).toBe(100);
        expect(GameConfig.enemies.spawnRate).toBe(2000);
        expect(GameConfig.enemies.types).toHaveLength(3);
        expect(GameConfig.enemies.types).toContain('basic');
        expect(GameConfig.enemies.types).toContain('fast');
        expect(GameConfig.enemies.types).toContain('heavy');
        return true;
    });
    
    this.it('devrait avoir 5 boss configurés', () => {
        expect(GameConfig.bosses).toHaveLength(5);
        
        const expectedBosses = [
            'Serpent Mécanique',
            'Croiseur Lourd',
            'Station Orbitale',
            'Dreadnought',
            'Core Alien'
        ];
        
        GameConfig.bosses.forEach((boss, index) => {
            expect(boss.name).toBe(expectedBosses[index]);
            expect(boss.health).toBeGreaterThan(0);
            expect(boss.pattern).toBeTruthy();
        });
        
        return true;
    });
    
    this.it('devrait avoir un système de scoring cohérent', () => {
        expect(GameConfig.scoring.enemy).toBe(100);
        expect(GameConfig.scoring.boss).toBe(1000);
        expect(GameConfig.scoring.levelComplete).toBe(5000);
        expect(GameConfig.scoring.lifeBonus).toBe(10000);
        
        // Le boss devrait valoir plus qu'un ennemi
        expect(GameConfig.scoring.boss).toBeGreaterThan(GameConfig.scoring.enemy);
        
        return true;
    });
    
    this.it('devrait avoir 5 niveaux avec difficulté progressive', () => {
        expect(GameConfig.levels.count).toBe(5);
        expect(GameConfig.levels.backgrounds).toHaveLength(5);
        expect(GameConfig.levels.difficulty).toHaveLength(5);
        
        // Vérifier que la difficulté augmente
        for (let i = 1; i < GameConfig.levels.difficulty.length; i++) {
            expect(GameConfig.levels.difficulty[i]).toBeGreaterThan(
                GameConfig.levels.difficulty[i - 1]
            );
        }
        
        return true;
    });
    
    this.it('devrait avoir des backgrounds uniques pour chaque niveau', () => {
        const backgrounds = GameConfig.levels.backgrounds;
        const uniqueBackgrounds = [...new Set(backgrounds)];
        expect(uniqueBackgrounds).toHaveLength(backgrounds.length);
        return true;
    });
    
    this.it('devrait avoir des patterns de boss uniques', () => {
        const patterns = GameConfig.bosses.map(boss => boss.pattern);
        const uniquePatterns = [...new Set(patterns)];
        expect(uniquePatterns).toHaveLength(patterns.length);
        return true;
    });
    
    this.it('devrait avoir une progression de santé des boss logique', () => {
        // Le boss final devrait avoir le plus de vie
        const finalBoss = GameConfig.bosses[GameConfig.bosses.length - 1];
        const firstBoss = GameConfig.bosses[0];
        
        expect(finalBoss.health).toBeGreaterThan(firstBoss.health);
        
        // Vérifier une progression générale
        let previousHealth = 0;
        GameConfig.bosses.forEach(boss => {
            expect(boss.health).toBeGreaterThan(previousHealth);
            previousHealth = boss.health;
        });
        
        return true;
    });
});
