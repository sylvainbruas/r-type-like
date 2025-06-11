// Framework de test simple pour R-Type 2
class TestFramework {
    constructor() {
        this.testSuites = [];
        this.stats = {
            passed: 0,
            failed: 0,
            pending: 0,
            total: 0
        };
    }
    
    describe(suiteName, callback) {
        const suite = new TestSuite(suiteName);
        this.testSuites.push(suite);
        
        // Contexte pour les tests
        const context = {
            it: (testName, testCallback) => suite.addTest(testName, testCallback),
            beforeEach: (callback) => suite.setBeforeEach(callback),
            afterEach: (callback) => suite.setAfterEach(callback)
        };
        
        callback.call(context, context);
        return suite;
    }
    
    async runAllTests() {
        this.clearStats();
        this.clearConsole();
        this.log('🚀 Démarrage des tests R-Type 2...\n');
        
        for (const suite of this.testSuites) {
            await this.runTestSuite(suite);
        }
        
        this.displayFinalResults();
    }
    
    async runTestSuite(suite) {
        this.log(`📦 Suite: ${suite.name}`);
        
        for (const test of suite.tests) {
            await this.runTest(suite, test);
        }
        
        this.log('');
    }
    
    async runTest(suite, test) {
        try {
            // Exécuter beforeEach si défini
            if (suite.beforeEach) {
                await suite.beforeEach();
            }
            
            // Exécuter le test
            const result = await test.callback();
            
            if (result === false) {
                throw new Error('Test assertion failed');
            }
            
            test.status = 'passed';
            this.stats.passed++;
            this.log(`  ✅ ${test.name}`);
            
        } catch (error) {
            test.status = 'failed';
            test.error = error.message;
            this.stats.failed++;
            this.log(`  ❌ ${test.name}: ${error.message}`);
            
        } finally {
            // Exécuter afterEach si défini
            if (suite.afterEach) {
                try {
                    await suite.afterEach();
                } catch (cleanupError) {
                    this.log(`  ⚠️ Cleanup error: ${cleanupError.message}`);
                }
            }
        }
        
        this.stats.total++;
        this.updateStatsDisplay();
        this.updateTestDisplay();
    }
    
    clearStats() {
        this.stats = { passed: 0, failed: 0, pending: 0, total: 0 };
    }
    
    clearConsole() {
        const console = document.getElementById('console-output');
        if (console) {
            console.innerHTML = '';
        }
    }
    
    log(message) {
        const console = document.getElementById('console-output');
        if (console) {
            const div = document.createElement('div');
            div.textContent = message;
            console.appendChild(div);
            console.scrollTop = console.scrollHeight;
        }
        console.log(message);
    }
    
    updateStatsDisplay() {
        document.getElementById('passed-count').textContent = this.stats.passed;
        document.getElementById('failed-count').textContent = this.stats.failed;
        document.getElementById('pending-count').textContent = this.stats.pending;
        document.getElementById('total-count').textContent = this.stats.total;
    }
    
    updateTestDisplay() {
        const container = document.getElementById('test-suites');
        container.innerHTML = '';
        
        this.testSuites.forEach(suite => {
            const suiteDiv = document.createElement('div');
            suiteDiv.className = 'test-suite';
            
            const title = document.createElement('h2');
            title.textContent = suite.name;
            suiteDiv.appendChild(title);
            
            suite.tests.forEach(test => {
                const testDiv = document.createElement('div');
                testDiv.className = `test-case ${test.status || 'pending'}`;
                
                const nameDiv = document.createElement('div');
                nameDiv.className = 'test-name';
                nameDiv.textContent = test.name;
                testDiv.appendChild(nameDiv);
                
                if (test.error) {
                    const errorDiv = document.createElement('div');
                    errorDiv.className = 'test-result';
                    errorDiv.textContent = `Erreur: ${test.error}`;
                    testDiv.appendChild(errorDiv);
                }
                
                suiteDiv.appendChild(testDiv);
            });
            
            container.appendChild(suiteDiv);
        });
    }
    
    displayFinalResults() {
        const passRate = this.stats.total > 0 ? 
            Math.round((this.stats.passed / this.stats.total) * 100) : 0;
        
        this.log(`\n📊 Résultats finaux:`);
        this.log(`   ✅ Réussis: ${this.stats.passed}`);
        this.log(`   ❌ Échoués: ${this.stats.failed}`);
        this.log(`   📈 Taux de réussite: ${passRate}%`);
        
        if (this.stats.failed === 0) {
            this.log(`\n🎉 Tous les tests sont passés avec succès !`);
        } else {
            this.log(`\n⚠️ ${this.stats.failed} test(s) ont échoué.`);
        }
    }
}

class TestSuite {
    constructor(name) {
        this.name = name;
        this.tests = [];
        this.beforeEach = null;
        this.afterEach = null;
    }
    
    addTest(name, callback) {
        this.tests.push({
            name,
            callback,
            status: 'pending'
        });
    }
    
    setBeforeEach(callback) {
        this.beforeEach = callback;
    }
    
    setAfterEach(callback) {
        this.afterEach = callback;
    }
}

// Fonctions d'assertion
const expect = (actual) => ({
    toBe: (expected) => {
        if (actual !== expected) {
            throw new Error(`Expected ${expected}, but got ${actual}`);
        }
        return true;
    },
    
    toEqual: (expected) => {
        if (JSON.stringify(actual) !== JSON.stringify(expected)) {
            throw new Error(`Expected ${JSON.stringify(expected)}, but got ${JSON.stringify(actual)}`);
        }
        return true;
    },
    
    toBeTruthy: () => {
        if (!actual) {
            throw new Error(`Expected truthy value, but got ${actual}`);
        }
        return true;
    },
    
    toBeFalsy: () => {
        if (actual) {
            throw new Error(`Expected falsy value, but got ${actual}`);
        }
        return true;
    },
    
    toBeGreaterThan: (expected) => {
        if (actual <= expected) {
            throw new Error(`Expected ${actual} to be greater than ${expected}`);
        }
        return true;
    },
    
    toBeLessThan: (expected) => {
        if (actual >= expected) {
            throw new Error(`Expected ${actual} to be less than ${expected}`);
        }
        return true;
    },
    
    toContain: (expected) => {
        if (!actual.includes(expected)) {
            throw new Error(`Expected ${actual} to contain ${expected}`);
        }
        return true;
    },
    
    toHaveLength: (expected) => {
        if (actual.length !== expected) {
            throw new Error(`Expected length ${expected}, but got ${actual.length}`);
        }
        return true;
    }
});

// Instance globale du framework
const testFramework = new TestFramework();

// Fonctions globales pour les tests
const describe = (name, callback) => testFramework.describe(name, callback);
const runAllTests = () => testFramework.runAllTests();
const updateStats = () => testFramework.updateStatsDisplay();
