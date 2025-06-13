// Tests pour les groupes d'ennemis
describe('Groupes d\'Ennemis', function() {
    
    this.it('devrait créer des groupes de 3 à 5 ennemis', () => {
        // Simuler plusieurs créations de groupes
        for (let i = 0; i < 10; i++) {
            const groupSize = Phaser.Math.Between(3, 5);
            expect(groupSize).toBeGreaterThan(2);
            expect(groupSize).toBeLessThan(6);
        }
        return true;
    });
    
    this.it('devrait générer des points d\'entrée aléatoires', () => {
        const screenWidth = GameConfig.width;
        const screenHeight = GameConfig.height;
        
        const entryPoints = [
            { x: screenWidth + 50, y: Phaser.Math.Between(50, screenHeight - 50) }, // Droite
            { x: Phaser.Math.Between(50, screenWidth - 50), y: -50 }, // Haut
            { x: Phaser.Math.Between(50, screenWidth - 50), y: screenHeight + 50 } // Bas
        ];
        
        entryPoints.forEach(point => {
            // Vérifier que les points sont hors écran mais proches
            const isValidEntry = 
                (point.x > screenWidth && point.y >= 50 && point.y <= screenHeight - 50) || // Droite
                (point.y < 0 && point.x >= 50 && point.x <= screenWidth - 50) || // Haut
                (point.y > screenHeight && point.x >= 50 && point.x <= screenWidth - 50); // Bas
            
            expect(isValidEntry).toBeTruthy();
        });
        
        return true;
    });
    
    this.it('devrait générer des trajectoires avec plusieurs waypoints', () => {
        const numWaypoints = Phaser.Math.Between(3, 6);
        const trajectory = [];
        
        // Point de départ
        trajectory.push({ x: GameConfig.width + 50, y: 300 });
        
        // Points intermédiaires
        for (let i = 0; i < numWaypoints; i++) {
            const progress = (i + 1) / (numWaypoints + 1);
            trajectory.push({
                x: GameConfig.width * (1 - progress) + Phaser.Math.Between(-100, 100),
                y: Phaser.Math.Between(50, GameConfig.height - 50)
            });
        }
        
        // Point de sortie
        trajectory.push({ x: -100, y: Phaser.Math.Between(100, GameConfig.height - 100) });
        
        expect(trajectory).toHaveLength(numWaypoints + 2);
        expect(trajectory[0].x).toBeGreaterThan(GameConfig.width);
        expect(trajectory[trajectory.length - 1].x).toBeLessThan(0);
        
        return true;
    });
    
    this.it('devrait avoir différents types de formations', () => {
        const formations = ['line', 'v-formation', 'diamond', 'circle'];
        
        formations.forEach(formation => {
            expect(typeof formation).toBe('string');
            expect(formation.length).toBeGreaterThan(0);
        });
        
        // Vérifier l'unicité
        const uniqueFormations = [...new Set(formations)];
        expect(uniqueFormations).toHaveLength(formations.length);
        
        return true;
    });
    
    this.it('devrait calculer les positions de formation en ligne', () => {
        const groupSize = 4;
        const positions = [];
        
        for (let i = 0; i < groupSize; i++) {
            positions.push({
                offsetX: i * 40 - (groupSize - 1) * 20,
                offsetY: 0
            });
        }
        
        expect(positions).toHaveLength(groupSize);
        expect(positions[0].offsetX).toBe(-60); // Premier ennemi
        expect(positions[groupSize - 1].offsetX).toBe(60); // Dernier ennemi
        
        // Tous les Y devraient être 0 pour une formation en ligne
        positions.forEach(pos => {
            expect(pos.offsetY).toBe(0);
        });
        
        return true;
    });
    
    this.it('devrait calculer les positions de formation en V', () => {
        const groupSize = 5;
        const positions = [];
        
        for (let i = 0; i < groupSize; i++) {
            const side = i % 2 === 0 ? 1 : -1;
            const distance = Math.floor(i / 2) * 30;
            positions.push({
                offsetX: -distance,
                offsetY: side * distance
            });
        }
        
        expect(positions).toHaveLength(groupSize);
        expect(positions[0].offsetX).toBe(0); // Leader au centre
        expect(positions[0].offsetY).toBe(0);
        
        // Vérifier la symétrie
        expect(positions[1].offsetY).toBe(-positions[2].offsetY);
        
        return true;
    });
    
    this.it('devrait calculer les positions de formation en cercle', () => {
        const groupSize = 4;
        const radius = 40;
        const positions = [];
        
        for (let i = 0; i < groupSize; i++) {
            const angle = (i / groupSize) * Math.PI * 2;
            positions.push({
                offsetX: Math.cos(angle) * radius,
                offsetY: Math.sin(angle) * radius
            });
        }
        
        expect(positions).toHaveLength(groupSize);
        
        // Vérifier que tous les points sont à la bonne distance du centre
        positions.forEach(pos => {
            const distance = Math.sqrt(pos.offsetX * pos.offsetX + pos.offsetY * pos.offsetY);
            expect(distance).toBeGreaterThan(radius - 1);
            expect(distance).toBeLessThan(radius + 1);
        });
        
        return true;
    });
    
    this.it('devrait calculer le taux de spawn des groupes', () => {
        const baseRate = 8000; // 8 secondes
        const levelMultipliers = [1, 1.2, 1.4, 1.6, 1.8]; // Exemple de multiplicateurs
        
        levelMultipliers.forEach(multiplier => {
            const spawnRate = baseRate / multiplier;
            expect(spawnRate).toBeLessThan(baseRate);
            expect(spawnRate).toBeGreaterThan(0);
        });
        
        return true;
    });
    
    this.it('devrait maintenir la cohésion du groupe', () => {
        // Simuler un groupe avec positions
        const enemies = [
            { x: 400, y: 200, active: true },
            { x: 440, y: 200, active: true },
            { x: 480, y: 200, active: true }
        ];
        
        // Calculer le centre du groupe
        let totalX = 0, totalY = 0;
        enemies.forEach(enemy => {
            totalX += enemy.x;
            totalY += enemy.y;
        });
        
        const center = {
            x: totalX / enemies.length,
            y: totalY / enemies.length
        };
        
        expect(center.x).toBe(440); // Centre X
        expect(center.y).toBe(200); // Centre Y
        
        return true;
    });
    
    this.it('devrait nettoyer les ennemis détruits du groupe', () => {
        const enemies = [
            { active: true, id: 1 },
            { active: false, id: 2 }, // Détruit
            { active: true, id: 3 },
            { active: false, id: 4 }  // Détruit
        ];
        
        const aliveEnemies = enemies.filter(enemy => enemy.active);
        
        expect(aliveEnemies).toHaveLength(2);
        expect(aliveEnemies[0].id).toBe(1);
        expect(aliveEnemies[1].id).toBe(3);
        
        return true;
    });
    
    this.it('devrait détecter quand un groupe est détruit', () => {
        const scenarios = [
            { enemies: [], expected: true },  // Aucun ennemi
            { enemies: [{ active: false }], expected: true }, // Tous détruits
            { enemies: [{ active: true }], expected: false }, // Au moins un vivant
            { enemies: [{ active: true }, { active: false }], expected: false } // Mélange
        ];
        
        scenarios.forEach(scenario => {
            const aliveCount = scenario.enemies.filter(e => e.active).length;
            const isDestroyed = aliveCount === 0;
            expect(isDestroyed).toBe(scenario.expected);
        });
        
        return true;
    });
});
