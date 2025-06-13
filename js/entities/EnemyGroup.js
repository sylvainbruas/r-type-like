// Classe pour gérer les groupes d'ennemis
class EnemyGroup {
    constructor(scene, entryPoint, groupSize) {
        this.scene = scene;
        this.enemies = [];
        this.groupSize = Phaser.Math.Between(3, 5); // Entre 3 et 5 ennemis
        this.entryPoint = entryPoint;
        this.trajectory = this.generateRandomTrajectory();
        this.currentWaypoint = 0;
        this.groupSpeed = Phaser.Math.Between(80, 120);
        this.formation = this.generateFormation();
        this.active = true;
        
        this.createGroup();
    }
    
    generateRandomTrajectory() {
        // Générer une trajectoire aléatoire avec plusieurs points de passage
        const waypoints = [];
        const numWaypoints = Phaser.Math.Between(3, 6);
        
        // Point de départ (entrée)
        waypoints.push({ x: this.entryPoint.x, y: this.entryPoint.y });
        
        // Points intermédiaires
        for (let i = 0; i < numWaypoints; i++) {
            const progress = (i + 1) / (numWaypoints + 1);
            waypoints.push({
                x: GameConfig.width * (1 - progress) + Phaser.Math.Between(-100, 100),
                y: Phaser.Math.Between(50, GameConfig.height - 50)
            });
        }
        
        // Point de sortie
        waypoints.push({ x: -100, y: Phaser.Math.Between(100, GameConfig.height - 100) });
        
        return waypoints;
    }
    
    generateFormation() {
        // Générer une formation pour le groupe
        const formations = ['line', 'v-formation', 'diamond', 'circle'];
        const formationType = Phaser.Utils.Array.GetRandom(formations);
        const positions = [];
        
        switch (formationType) {
            case 'line':
                for (let i = 0; i < this.groupSize; i++) {
                    positions.push({
                        offsetX: i * 40 - (this.groupSize - 1) * 20,
                        offsetY: 0
                    });
                }
                break;
                
            case 'v-formation':
                for (let i = 0; i < this.groupSize; i++) {
                    const side = i % 2 === 0 ? 1 : -1;
                    const distance = Math.floor(i / 2) * 30;
                    positions.push({
                        offsetX: -distance,
                        offsetY: side * distance
                    });
                }
                break;
                
            case 'diamond':
                const center = Math.floor(this.groupSize / 2);
                for (let i = 0; i < this.groupSize; i++) {
                    const distFromCenter = Math.abs(i - center);
                    positions.push({
                        offsetX: -distFromCenter * 25,
                        offsetY: (i - center) * 30
                    });
                }
                break;
                
            case 'circle':
                const radius = 40;
                for (let i = 0; i < this.groupSize; i++) {
                    const angle = (i / this.groupSize) * Math.PI * 2;
                    positions.push({
                        offsetX: Math.cos(angle) * radius,
                        offsetY: Math.sin(angle) * radius
                    });
                }
                break;
        }
        
        return { type: formationType, positions };
    }
    
    createGroup() {
        const basePosition = this.trajectory[0];
        
        for (let i = 0; i < this.groupSize; i++) {
            const formationPos = this.formation.positions[i];
            const enemy = new Enemy(
                this.scene,
                basePosition.x + formationPos.offsetX,
                basePosition.y + formationPos.offsetY,
                'basic'
            );
            
            // Marquer l'ennemi comme faisant partie d'un groupe
            enemy.isInGroup = true;
            enemy.groupId = this.scene.time.now + Math.random();
            enemy.formationOffset = formationPos;
            
            this.enemies.push(enemy);
            this.scene.enemies.add(enemy);
        }
        
        console.log(`Created enemy group: ${this.formation.type} formation with ${this.groupSize} enemies`);
    }
    
    update() {
        if (!this.active || this.enemies.length === 0) {
            return;
        }
        
        // Nettoyer les ennemis détruits
        this.enemies = this.enemies.filter(enemy => enemy.active);
        
        if (this.enemies.length === 0) {
            this.active = false;
            return;
        }
        
        // Calculer la position du leader (centre du groupe)
        const targetWaypoint = this.trajectory[this.currentWaypoint];
        if (!targetWaypoint) {
            this.active = false;
            return;
        }
        
        // Vérifier si le groupe a atteint le waypoint actuel
        const leaderPos = this.getGroupCenter();
        const distanceToWaypoint = Phaser.Math.Distance.Between(
            leaderPos.x, leaderPos.y,
            targetWaypoint.x, targetWaypoint.y
        );
        
        if (distanceToWaypoint < 50 && this.currentWaypoint < this.trajectory.length - 1) {
            this.currentWaypoint++;
        }
        
        // Déplacer tous les ennemis du groupe
        this.moveGroup();
    }
    
    getGroupCenter() {
        if (this.enemies.length === 0) return { x: 0, y: 0 };
        
        let totalX = 0, totalY = 0;
        this.enemies.forEach(enemy => {
            totalX += enemy.x;
            totalY += enemy.y;
        });
        
        return {
            x: totalX / this.enemies.length,
            y: totalY / this.enemies.length
        };
    }
    
    moveGroup() {
        const targetWaypoint = this.trajectory[this.currentWaypoint];
        if (!targetWaypoint) return;
        
        const groupCenter = this.getGroupCenter();
        
        // Calculer la direction vers le waypoint
        const dx = targetWaypoint.x - groupCenter.x;
        const dy = targetWaypoint.y - groupCenter.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance > 0) {
            const normalizedX = dx / distance;
            const normalizedY = dy / distance;
            
            // Déplacer chaque ennemi en maintenant la formation
            this.enemies.forEach((enemy, index) => {
                if (!enemy.active) return;
                
                const formationPos = this.formation.positions[index];
                const targetX = groupCenter.x + dx + formationPos.offsetX;
                const targetY = groupCenter.y + dy + formationPos.offsetY;
                
                // Calculer la vélocité pour cet ennemi
                const enemyDx = targetX - enemy.x;
                const enemyDy = targetY - enemy.y;
                const enemyDistance = Math.sqrt(enemyDx * enemyDx + enemyDy * enemyDy);
                
                if (enemyDistance > 5) {
                    enemy.setVelocity(
                        (enemyDx / enemyDistance) * this.groupSpeed,
                        (enemyDy / enemyDistance) * this.groupSpeed
                    );
                } else {
                    // Maintenir la formation si proche de la position cible
                    enemy.setVelocity(
                        normalizedX * this.groupSpeed,
                        normalizedY * this.groupSpeed
                    );
                }
            });
        }
    }
    
    destroy() {
        this.enemies.forEach(enemy => {
            if (enemy.active) {
                enemy.destroy();
            }
        });
        this.enemies = [];
        this.active = false;
    }
    
    getAliveCount() {
        return this.enemies.filter(enemy => enemy.active).length;
    }
    
    isDestroyed() {
        return !this.active || this.getAliveCount() === 0;
    }
}
