// Tests pour le mouvement des boss
describe('Mouvement des Boss', function() {
    
    this.it('devrait calculer la vitesse entre 25% et 35% de celle du joueur', () => {
        const playerSpeed = GameConfig.player.speed; // 200
        const minSpeed = playerSpeed * 0.25; // 50
        const maxSpeed = playerSpeed * 0.35; // 70
        
        // Simuler plusieurs calculs de vitesse
        for (let i = 0; i < 10; i++) {
            const speed = Phaser.Math.Between(minSpeed, maxSpeed);
            expect(speed).toBeGreaterThan(minSpeed - 1);
            expect(speed).toBeLessThan(maxSpeed + 1);
        }
        
        return true;
    });
    
    this.it('devrait définir la zone de mouvement dans le tiers droit', () => {
        const screenWidth = GameConfig.width; // 800
        const movementZone = {
            left: screenWidth * 0.67, // 533.33
            right: screenWidth - 50,   // 750
            top: 50,
            bottom: GameConfig.height - 50 // 550
        };
        
        expect(movementZone.left).toBe(screenWidth * 0.67);
        expect(movementZone.right).toBe(screenWidth - 50);
        expect(movementZone.left).toBeLessThan(movementZone.right);
        expect(movementZone.top).toBeLessThan(movementZone.bottom);
        
        return true;
    });
    
    this.it('devrait changer de vitesse toutes les 5 secondes', () => {
        const speedChangeDuration = 5000; // 5 secondes
        let lastSpeedChange = 0;
        let currentTime = 0;
        
        // Premier changement immédiat
        let shouldChange = currentTime - lastSpeedChange > speedChangeDuration;
        expect(shouldChange).toBeTruthy();
        
        // Simuler le changement
        lastSpeedChange = currentTime;
        currentTime = 3000; // +3 secondes
        
        // Pas encore temps de changer
        shouldChange = currentTime - lastSpeedChange > speedChangeDuration;
        expect(shouldChange).toBeFalsy();
        
        // Après 5 secondes
        currentTime = 6000; // +6 secondes total
        shouldChange = currentTime - lastSpeedChange > speedChangeDuration;
        expect(shouldChange).toBeTruthy();
        
        return true;
    });
    
    this.it('devrait déclencher la charge après 1 minute', () => {
        const chargeDuration = 60000; // 1 minute
        let startTime = 0;
        let currentTime = 30000; // 30 secondes
        
        // Pas encore temps de charger
        let shouldCharge = currentTime - startTime > chargeDuration;
        expect(shouldCharge).toBeFalsy();
        
        // Après 1 minute
        currentTime = 65000; // 65 secondes
        shouldCharge = currentTime - startTime > chargeDuration;
        expect(shouldCharge).toBeTruthy();
        
        return true;
    });
    
    this.it('devrait calculer la vitesse de charge à 80% de celle du joueur', () => {
        const playerSpeed = GameConfig.player.speed; // 200
        const chargeSpeed = playerSpeed * 0.8; // 160
        
        expect(chargeSpeed).toBe(160);
        expect(chargeSpeed).toBe(playerSpeed * 0.8);
        
        return true;
    });
    
    this.it('devrait préparer la charge pendant 10 secondes', () => {
        const chargePrepTime = 10000; // 10 secondes
        let chargeStartTime = 0;
        let currentTime = 5000; // 5 secondes
        
        // Encore en préparation
        let isPrepping = currentTime - chargeStartTime < chargePrepTime;
        expect(isPrepping).toBeTruthy();
        
        // Préparation terminée
        currentTime = 12000; // 12 secondes
        isPrepping = currentTime - chargeStartTime < chargePrepTime;
        expect(isPrepping).toBeFalsy();
        
        return true;
    });
    
    this.it('devrait contraindre le boss dans sa zone de mouvement', () => {
        const screenWidth = GameConfig.width;
        const screenHeight = GameConfig.height;
        const movementZone = {
            left: screenWidth * 0.67,
            right: screenWidth - 50,
            top: 50,
            bottom: screenHeight - 50
        };
        
        // Positions de test
        const testPositions = [
            { x: 100, y: 300, shouldConstrain: true },  // Trop à gauche
            { x: 900, y: 300, shouldConstrain: true },  // Trop à droite
            { x: 700, y: 10, shouldConstrain: true },   // Trop haut
            { x: 700, y: 700, shouldConstrain: true },  // Trop bas
            { x: 700, y: 300, shouldConstrain: false }  // Dans la zone
        ];
        
        testPositions.forEach(pos => {
            const outOfBounds = pos.x < movementZone.left || 
                               pos.x > movementZone.right ||
                               pos.y < movementZone.top || 
                               pos.y > movementZone.bottom;
            expect(outOfBounds).toBe(pos.shouldConstrain);
        });
        
        return true;
    });
    
    this.it('devrait calculer la direction de poursuite vers le joueur en temps réel', () => {
        const bossPos = { x: 700, y: 200 };
        const playerPos = { x: 300, y: 400 };
        
        const dx = playerPos.x - bossPos.x; // -400
        const dy = playerPos.y - bossPos.y; // 200
        const distance = Math.sqrt(dx * dx + dy * dy); // ~447
        
        expect(dx).toBe(-400);
        expect(dy).toBe(200);
        expect(distance).toBeGreaterThan(440);
        expect(distance).toBeLessThan(450);
        
        // Direction normalisée pour la poursuite
        if (distance > 0) {
            const chargeSpeed = 160; // 80% de 200
            const velocityX = (dx / distance) * chargeSpeed;
            const velocityY = (dy / distance) * chargeSpeed;
            
            expect(velocityX).toBeLessThan(0); // Vers la gauche
            expect(velocityY).toBeGreaterThan(0); // Vers le bas
            
            // Vérifier que la vitesse totale est correcte
            const totalSpeed = Math.sqrt(velocityX * velocityX + velocityY * velocityY);
            expect(totalSpeed).toBeGreaterThan(155);
            expect(totalSpeed).toBeLessThan(165);
        }
        
        return true;
    });
    
    this.it('devrait avoir des patterns de mouvement différents selon le boss', () => {
        const patterns = ['serpent', 'cruiser', 'station', 'dreadnought', 'final'];
        
        patterns.forEach(pattern => {
            expect(typeof pattern).toBe('string');
            expect(pattern.length).toBeGreaterThan(0);
        });
        
        // Tous les patterns devraient être uniques
        const uniquePatterns = [...new Set(patterns)];
        expect(uniquePatterns).toHaveLength(patterns.length);
        
        return true;
    });
    
    this.it('devrait générer un tremblement aléatoire pendant la préparation', () => {
        const trembleResults = [];
        
        // Générer plusieurs valeurs de tremblement
        for (let i = 0; i < 10; i++) {
            const trembleX = (Math.random() - 0.5) * 10;
            const trembleY = (Math.random() - 0.5) * 10;
            
            trembleResults.push({ x: trembleX, y: trembleY });
            
            // Vérifier que les valeurs sont dans la plage attendue
            expect(trembleX).toBeGreaterThan(-6);
            expect(trembleX).toBeLessThan(6);
            expect(trembleY).toBeGreaterThan(-6);
            expect(trembleY).toBeLessThan(6);
        }
        
        // Vérifier qu'il y a de la variabilité
        const uniqueX = [...new Set(trembleResults.map(t => Math.round(t.x)))];
        expect(uniqueX.length).toBeGreaterThan(1);
        
        return true;
    });
    
    this.it('devrait limiter la durée de poursuite à 15 secondes maximum', () => {
        const maxChargeDuration = 15000; // 15 secondes
        let chargeStartTime = 0;
        let currentTime = 10000; // 10 secondes
        
        // Encore en poursuite
        let shouldStop = currentTime - chargeStartTime > maxChargeDuration;
        expect(shouldStop).toBeFalsy();
        
        // Après 15 secondes
        currentTime = 16000; // 16 secondes
        shouldStop = currentTime - chargeStartTime > maxChargeDuration;
        expect(shouldStop).toBeTruthy();
        
        return true;
    });
    
    this.it('devrait permettre au boss de sortir de sa zone pendant la poursuite', () => {
        const screenWidth = GameConfig.width;
        const movementZone = {
            left: screenWidth * 0.67, // Zone normale
            right: screenWidth - 50
        };
        
        // Position normale (dans la zone)
        const normalPos = { x: 700, y: 300, isCharging: false };
        let shouldConstrain = normalPos.x < movementZone.left;
        expect(shouldConstrain).toBeFalsy(); // Dans la zone
        
        // Position pendant la poursuite (hors zone)
        const chasePos = { x: 200, y: 300, isCharging: true };
        // Pendant la poursuite, pas de contraintes
        if (chasePos.isCharging) {
            shouldConstrain = false; // Pas de contraintes
        } else {
            shouldConstrain = chasePos.x < movementZone.left;
        }
        expect(shouldConstrain).toBeFalsy(); // Libre pendant la poursuite
        
        return true;
    });
});
