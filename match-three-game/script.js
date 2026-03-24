class MatchThreeGame {
    constructor() {
        this.boardSize = 6;
        this.board = [];
        this.score = 0;
        this.level = 1;
        this.time = 60;
        this.timeInterval = null;
        this.combo = 0;
        this.difficulty = 'easy'; // 默认为简单模式
        this.selectedTile = null;
        this.gameBoard = document.getElementById('game-board');
        this.scoreElement = document.getElementById('score');
        this.levelElement = document.getElementById('level');
        this.timeElement = document.getElementById('time');
        this.requiredScoreElement = document.getElementById('required-score');
        this.startButton = document.getElementById('start-button');
        this.pauseButton = document.getElementById('pause-button');
        this.homeButton = document.getElementById('home-button');
        this.leaderboard = document.getElementById('leaderboard');
        this.leaderboardList = document.getElementById('leaderboard-list');
        this.gameOverModal = document.getElementById('game-over-modal');
        this.finalScoreElement = document.getElementById('final-score');
        this.finalLevelElement = document.getElementById('final-level');
        this.restartButton = document.getElementById('restart-button');
        this.difficultyButtons = document.querySelectorAll('.difficulty-button');
        this.homeScreen = document.querySelector('.home-screen');
        this.gameScreen = document.querySelector('.game-screen');
        this.isPaused = false;
        this.leaderboardData = this.loadLeaderboard();
        this.init();
    }

    init() {
        // 初始显示主屏幕，隐藏游戏屏幕
        this.homeScreen.style.display = 'flex';
        this.gameScreen.style.display = 'none';
        
        // 更新排行榜显示
        this.updateLeaderboardDisplay();
        
        this.startButton.addEventListener('click', () => this.startGame());
        this.restartButton.addEventListener('click', () => this.startGame());
        this.pauseButton.addEventListener('click', () => this.togglePause());
        this.homeButton.addEventListener('click', () => this.returnHome());
        
        // 添加难度选择按钮的事件监听器
        this.difficultyButtons.forEach(button => {
            button.addEventListener('click', () => {
                // 移除所有按钮的 active 类
                this.difficultyButtons.forEach(btn => btn.classList.remove('active'));
                // 添加当前按钮的 active 类
                button.classList.add('active');
                // 设置难度
                this.difficulty = button.dataset.difficulty;
                // 更新排行榜显示
                this.updateLeaderboardDisplay();
            });
        });
    }

    startGame() {
        // 重置游戏状态
        this.score = 0;
        this.level = 1;
        this.combo = 0;
        this.isPaused = false;
        
        // 根据难度设置初始时间
        switch (this.difficulty) {
            case 'easy':
                this.time = 90; // 简单模式 90秒
                break;
            case 'hard':
                this.time = 60; // 困难模式 60秒
                break;
            case 'nightmare':
                this.time = 30; // 噩梦模式 30秒
                break;
        }
        
        // 清除之前的倒计时
        if (this.timeInterval) {
            clearInterval(this.timeInterval);
        }
        
        // 显示游戏屏幕，隐藏主屏幕
        this.gameScreen.style.display = 'flex';
        this.homeScreen.style.display = 'none';
        
        // 更新显示
        this.updateScore();
        this.updateLevel();
        this.updateTime();
        this.updateRequiredScore();
        
        // 隐藏游戏结束弹窗
        this.gameOverModal.style.display = 'none';
        
        // 生成棋盘
        this.generateBoard();
        this.renderBoard();
        
        // 开始倒计时
        this.startTimer();
    }

    loadLeaderboard() {
        // 从localStorage加载排行榜数据
        const saved = localStorage.getItem('matchThreeLeaderboard');
        if (saved) {
            return JSON.parse(saved);
        }
        // 默认排行榜数据，为每个难度创建独立的排行榜
        return {
            easy: [
                { name: '玩家1', score: 1000 },
                { name: '玩家2', score: 800 },
                { name: '玩家3', score: 600 },
                { name: '玩家4', score: 400 },
                { name: '玩家5', score: 300 },
                { name: '玩家6', score: 200 },
                { name: '玩家7', score: 150 },
                { name: '玩家8', score: 100 },
                { name: '玩家9', score: 50 },
                { name: '玩家10', score: 10 }
            ],
            hard: [
                { name: '玩家1', score: 1500 },
                { name: '玩家2', score: 1200 },
                { name: '玩家3', score: 900 },
                { name: '玩家4', score: 600 },
                { name: '玩家5', score: 450 },
                { name: '玩家6', score: 300 },
                { name: '玩家7', score: 225 },
                { name: '玩家8', score: 150 },
                { name: '玩家9', score: 75 },
                { name: '玩家10', score: 15 }
            ],
            nightmare: [
                { name: '玩家1', score: 2000 },
                { name: '玩家2', score: 1600 },
                { name: '玩家3', score: 1200 },
                { name: '玩家4', score: 800 },
                { name: '玩家5', score: 600 },
                { name: '玩家6', score: 400 },
                { name: '玩家7', score: 300 },
                { name: '玩家8', score: 200 },
                { name: '玩家9', score: 100 },
                { name: '玩家10', score: 20 }
            ]
        };
    }

    saveLeaderboard() {
        // 保存排行榜数据到localStorage
        localStorage.setItem('matchThreeLeaderboard', JSON.stringify(this.leaderboardData));
    }

    updateLeaderboard(score) {
        // 询问玩家名字
        const playerName = prompt('游戏结束！请输入你的名字:', '玩家' + (Math.floor(Math.random() * 1000)));
        if (playerName) {
            // 添加新分数到对应难度的排行榜
            this.leaderboardData[this.difficulty].push({ name: playerName, score: score });
            // 按分数排序
            this.leaderboardData[this.difficulty].sort((a, b) => b.score - a.score);
            // 只保留前10名
            this.leaderboardData[this.difficulty] = this.leaderboardData[this.difficulty].slice(0, 10);
            // 保存到localStorage
            this.saveLeaderboard();
            // 更新显示
            this.updateLeaderboardDisplay();
        }
    }

    updateLeaderboardDisplay() {
        // 清空排行榜
        this.leaderboardList.innerHTML = '';
        
        // 生成当前难度的排行榜项
        this.leaderboardData[this.difficulty].forEach((item, index) => {
            const leaderboardItem = document.createElement('div');
            leaderboardItem.classList.add('leaderboard-item');
            leaderboardItem.innerHTML = `
                <span>${index + 1}. ${item.name}</span>
                <span>${item.score}</span>
            `;
            this.leaderboardList.appendChild(leaderboardItem);
        });
    }

    togglePause() {
        this.isPaused = !this.isPaused;
        if (this.isPaused) {
            // 暂停游戏
            clearInterval(this.timeInterval);
            this.pauseButton.textContent = '继续';
            // 可以添加暂停提示
        } else {
            // 继续游戏
            this.startTimer();
            this.pauseButton.textContent = '暂停';
        }
    }

    returnHome() {
        // 清除倒计时
        if (this.timeInterval) {
            clearInterval(this.timeInterval);
        }
        
        // 显示主屏幕，隐藏游戏屏幕
        this.homeScreen.style.display = 'flex';
        this.gameScreen.style.display = 'none';
        
        // 重置游戏状态
        this.score = 0;
        this.level = 1;
        this.combo = 0;
        this.isPaused = false;
        
        // 更新显示
        this.updateScore();
        this.updateLevel();
        this.updateTime();
        this.updateRequiredScore();
        
        // 清空棋盘
        this.gameBoard.innerHTML = '';
    }

    startTimer() {
        this.timeInterval = setInterval(() => {
            this.time--;
            this.updateTime();
            
            if (this.time <= 0) {
                this.gameOver();
            }
        }, 1000);
    }

    updateLevel() {
        this.levelElement.textContent = this.level;
    }

    updateTime() {
        this.timeElement.textContent = this.time;
    }

    gameOver() {
        // 清除倒计时
        if (this.timeInterval) {
            clearInterval(this.timeInterval);
        }
        
        // 显示游戏结束弹窗
        this.finalScoreElement.textContent = this.score;
        this.finalLevelElement.textContent = this.level;
        this.gameOverModal.style.display = 'flex';
        
        // 更新排行榜
        this.updateLeaderboard(this.score);
        
        // 显示主屏幕，隐藏游戏屏幕
        this.homeScreen.style.display = 'flex';
        this.gameScreen.style.display = 'none';
    }

    generateBoard() {
        this.board = [];
        for (let row = 0; row < this.boardSize; row++) {
            this.board[row] = [];
            for (let col = 0; col < this.boardSize; col++) {
                let value;
                do {
                    value = Math.floor(Math.random() * 6) + 1;
                } while (this.checkThreeInARow(row, col, value));
                this.board[row][col] = value;
            }
        }
    }

    checkThreeInARow(row, col, value) {
        let count = 1;
        // 检查水平方向
        for (let c = col - 1; c >= 0; c--) {
            if (this.board[row] && this.board[row][c] === value) {
                count++;
            } else {
                break;
            }
        }
        if (count >= 3) return true;

        count = 1;
        // 检查垂直方向
        for (let r = row - 1; r >= 0; r--) {
            if (this.board[r] && this.board[r][col] === value) {
                count++;
            } else {
                break;
            }
        }
        return count >= 3;
    }

    renderBoard() {
        this.gameBoard.innerHTML = '';
        for (let row = 0; row < this.boardSize; row++) {
            for (let col = 0; col < this.boardSize; col++) {
                const tile = document.createElement('div');
                tile.classList.add('game-tile', `tile-${this.board[row][col]}`);
                tile.dataset.row = row;
                tile.dataset.col = col;
                tile.addEventListener('click', () => this.handleTileClick(row, col));
                tile.addEventListener('touchstart', (e) => {
                    e.preventDefault();
                    this.handleTileClick(row, col);
                });
                this.gameBoard.appendChild(tile);
            }
        }
    }

    handleTileClick(row, col) {
        if (!this.selectedTile) {
            // 选择第一个方块
            this.selectedTile = { row, col };
            const tile = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
            tile.classList.add('selected');
        } else {
            // 选择第二个方块，检查是否可以交换
            if (this.isAdjacent(this.selectedTile, { row, col })) {
                // 保存原始状态
                const originalTile1Value = this.board[this.selectedTile.row][this.selectedTile.col];
                const originalTile2Value = this.board[row][col];
                
                // 虚拟交换，检查是否会形成匹配
                this.board[this.selectedTile.row][this.selectedTile.col] = originalTile2Value;
                this.board[row][col] = originalTile1Value;
                
                // 检查是否有匹配
                const hasMatch = this.checkMatches();
                
                // 恢复原始状态
                this.board[this.selectedTile.row][this.selectedTile.col] = originalTile1Value;
                this.board[row][col] = originalTile2Value;
                
                // 只有当交换能够形成匹配时，才执行交换
                if (hasMatch) {
                    // 实际交换方块
                    this.swapTiles(this.selectedTile, { row, col }, () => {
                        // 等待交换动画完成后处理消除
                        this.removeMatches();
                        // 等待消除动画完成后再填充空方块
                        setTimeout(() => {
                            this.fillEmptySpaces();
                            this.updateScore();
                        }, 500);
                    });
                } else {
                    // 如果没有匹配，不执行交换，只显示选中效果并播放提示音效
                    const tileElement = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
                    if (tileElement) {
                        // 播放提示音效
                        const audio = new Audio('data:audio/wav;base64,UklGRigAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQAAAAA=');
                        audio.play().catch(e => console.log('Audio play failed:', e));
                        
                        // 显示选中效果
                        tileElement.classList.add('selected');
                        setTimeout(() => {
                            tileElement.classList.remove('selected');
                        }, 600);
                    }
                }
            }
            // 清除选择状态
            const selectedTile = document.querySelector(`[data-row="${this.selectedTile.row}"][data-col="${this.selectedTile.col}"]`);
            if (selectedTile) {
                selectedTile.classList.remove('selected');
            }
            this.selectedTile = null;
        }
    }

    isAdjacent(tile1, tile2) {
        const rowDiff = Math.abs(tile1.row - tile2.row);
        const colDiff = Math.abs(tile1.col - tile2.col);
        return (rowDiff === 1 && colDiff === 0) || (rowDiff === 0 && colDiff === 1);
    }

    swapTiles(tile1, tile2, callback) {
        // 获取两个方块的元素
        const tileElement1 = document.querySelector(`[data-row="${tile1.row}"][data-col="${tile1.col}"]`);
        const tileElement2 = document.querySelector(`[data-row="${tile2.row}"][data-col="${tile2.col}"]`);
        
        if (tileElement1 && tileElement2) {
            // 获取方块的位置信息
            const rect1 = tileElement1.getBoundingClientRect();
            const rect2 = tileElement2.getBoundingClientRect();
            
            // 计算移动距离
            const dx = rect2.left - rect1.left;
            const dy = rect2.top - rect1.top;
            
            // 设置 CSS 变量，控制移动方向和距离
            tileElement1.style.setProperty('--tx', `${dx}px`);
            tileElement1.style.setProperty('--ty', `${dy}px`);
            tileElement2.style.setProperty('--tx', `${-dx}px`);
            tileElement2.style.setProperty('--ty', `${-dy}px`);
            
            // 添加交互式交换动画
            tileElement1.style.animation = 'swap-interactive 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards';
            tileElement2.style.animation = 'swap-interactive 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards';
            
            // 等待动画完成后交换数据并重新渲染
            setTimeout(() => {
                // 交换数据
                const temp = this.board[tile1.row][tile1.col];
                this.board[tile1.row][tile1.col] = this.board[tile2.row][tile2.col];
                this.board[tile2.row][tile2.col] = temp;
                
                // 重新渲染棋盘
                this.renderBoard();
                
                // 执行回调函数
                if (callback) {
                    callback();
                }
            }, 600);
        } else {
            // 如果找不到元素，直接交换数据并重新渲染
            const temp = this.board[tile1.row][tile1.col];
            this.board[tile1.row][tile1.col] = this.board[tile2.row][tile2.col];
            this.board[tile2.row][tile2.col] = temp;
            this.renderBoard();
            
            // 执行回调函数
            if (callback) {
                callback();
            }
        }
    }

    checkMatches() {
        let hasMatches = false;
        for (let row = 0; row < this.boardSize; row++) {
            for (let col = 0; col < this.boardSize; col++) {
                if (this.checkMatchAt(row, col)) {
                    hasMatches = true;
                }
            }
        }
        return hasMatches;
    }

    checkNoPossibleMatches() {
        // 检查是否存在任何可能的匹配
        for (let row = 0; row < this.boardSize; row++) {
            for (let col = 0; col < this.boardSize; col++) {
                // 检查水平交换
                if (col < this.boardSize - 1) {
                    // 交换
                    const temp = this.board[row][col];
                    this.board[row][col] = this.board[row][col + 1];
                    this.board[row][col + 1] = temp;
                    
                    // 检查是否有匹配
                    if (this.checkMatches()) {
                        // 恢复
                        this.board[row][col + 1] = this.board[row][col];
                        this.board[row][col] = temp;
                        return false;
                    }
                    
                    // 恢复
                    this.board[row][col + 1] = this.board[row][col];
                    this.board[row][col] = temp;
                }
                
                // 检查垂直交换
                if (row < this.boardSize - 1) {
                    // 交换
                    const temp = this.board[row][col];
                    this.board[row][col] = this.board[row + 1][col];
                    this.board[row + 1][col] = temp;
                    
                    // 检查是否有匹配
                    if (this.checkMatches()) {
                        // 恢复
                        this.board[row + 1][col] = this.board[row][col];
                        this.board[row][col] = temp;
                        return false;
                    }
                    
                    // 恢复
                    this.board[row + 1][col] = this.board[row][col];
                    this.board[row][col] = temp;
                }
            }
        }
        return true;
    }

    checkMatchAt(row, col) {
        const value = this.board[row][col];
        if (!value) return false;

        // 检查水平匹配
        let horizontalMatch = true;
        for (let c = col; c < col + 3; c++) {
            if (c >= this.boardSize || this.board[row][c] !== value) {
                horizontalMatch = false;
                break;
            }
        }

        // 检查垂直匹配
        let verticalMatch = true;
        for (let r = row; r < row + 3; r++) {
            if (r >= this.boardSize || this.board[r][col] !== value) {
                verticalMatch = false;
                break;
            }
        }

        return horizontalMatch || verticalMatch;
    }

    removeMatches() {
        const matches = [];
        for (let row = 0; row < this.boardSize; row++) {
            for (let col = 0; col < this.boardSize; col++) {
                if (this.checkMatchAt(row, col)) {
                    // 水平匹配
                    if (col + 2 < this.boardSize && 
                        this.board[row][col] === this.board[row][col + 1] && 
                        this.board[row][col] === this.board[row][col + 2]) {
                        matches.push({ row, col });
                        matches.push({ row, col: col + 1 });
                        matches.push({ row, col: col + 2 });
                    }
                    // 垂直匹配
                    if (row + 2 < this.boardSize && 
                        this.board[row][col] === this.board[row + 1][col] && 
                        this.board[row][col] === this.board[row + 2][col]) {
                        matches.push({ row, col });
                        matches.push({ row: row + 1, col });
                        matches.push({ row: row + 2, col });
                    }
                }
            }
        }

        // 去重
        const uniqueMatches = new Set(matches.map(m => `${m.row},${m.col}`));
        
        // 为匹配的方块添加动画效果
        uniqueMatches.forEach(match => {
            const [row, col] = match.split(',').map(Number);
            const tile = document.querySelector(`[data-row="${row}"][data-col="${col}"]`);
            if (tile) {
                tile.classList.add('removed');
            }
        });
        
        // 等待动画完成后移除方块
        setTimeout(() => {
            // 增加连击数
            this.combo++;
            
            // 计算得分，根据连击数翻倍
            const matchCount = uniqueMatches.size;
            const baseScore = matchCount * 3; // 提升基础分数
            const comboMultiplier = 1 + (this.combo - 1) * 0.8; // 增加连击倍数，每次连击增加80%的得分
            const totalScore = Math.floor(baseScore * comboMultiplier);
            
            // 增加得分
            this.score += totalScore;
            
            // 移除匹配的方块
            uniqueMatches.forEach(match => {
                const [row, col] = match.split(',').map(Number);
                this.board[row][col] = 0;
            });
            
            // 重置连击数（如果没有匹配）
            if (matchCount === 0) {
                this.combo = 0;
            }
        }, 300);
    }

    shuffleBoard() {
        // 重新生成棋盘
        this.generateBoard();
        this.renderBoard();
        
        // 检查是否仍然没有可消除的匹配
        if (this.checkNoPossibleMatches()) {
            // 递归调用直到有可消除的匹配
            this.shuffleBoard();
        }
    }

    fillEmptySpaces() {
        // 从下往上填充空方块
        for (let col = 0; col < this.boardSize; col++) {
            let emptyRow = this.boardSize - 1;
            for (let row = this.boardSize - 1; row >= 0; row--) {
                if (this.board[row][col] !== 0) {
                    this.board[emptyRow][col] = this.board[row][col];
                    if (emptyRow !== row) {
                        this.board[row][col] = 0;
                    }
                    emptyRow--;
                }
            }
            // 顶部填充新方块
            for (let row = emptyRow; row >= 0; row--) {
                this.board[row][col] = Math.floor(Math.random() * 6) + 1;
            }
        }
        // 重新渲染棋盘
        this.renderBoard();
        // 检查是否有新的匹配
        if (this.checkMatches()) {
            setTimeout(() => {
                this.removeMatches();
                // 等待动画完成后再填充空方块
                setTimeout(() => {
                    this.fillEmptySpaces();
                    this.updateScore();
                }, 500);
            }, 600);
        } else {
            // 如果没有新的匹配，检查是否存在可消除的匹配
            if (this.checkNoPossibleMatches()) {
                // 提示用户并重新打乱棋盘
                alert('没有可消除的方块，正在重新打乱棋盘...');
                this.shuffleBoard();
            }
            // 重置连击数
            this.combo = 0;
        }
    }

    updateRequiredScore() {
        // 根据难度设置不同的分数要求
        let requiredScore;
        switch (this.difficulty) {
            case 'easy':
                requiredScore = this.level * 80; // 简单模式，每级 80 分（缩小十倍）
                break;
            case 'hard':
                requiredScore = this.level * 120; // 困难模式，每级 120 分（缩小十倍）
                break;
            case 'nightmare':
                requiredScore = this.level * 160; // 噩梦模式，每级 160 分（缩小十倍）
                break;
        }
        this.requiredScoreElement.textContent = requiredScore;
        return requiredScore;
    }

    updateScore() {
        this.scoreElement.textContent = this.score;
        
        const requiredScore = this.updateRequiredScore();
        
        if (this.score >= requiredScore) {
            this.levelUp();
        }
    }

    levelUp() {
        this.level++;
        
        // 根据难度设置不同的时间奖励
        let timeBonus;
        switch (this.difficulty) {
            case 'easy':
                timeBonus = 40; // 简单模式，每级 +40 秒
                break;
            case 'hard':
                timeBonus = 30; // 困难模式，每级 +30 秒
                break;
            case 'nightmare':
                timeBonus = 20; // 噩梦模式，每级 +20 秒
                break;
        }
        
        this.time += timeBonus;
        this.updateLevel();
        this.updateTime();
        this.updateRequiredScore();
    }
}

// 初始化游戏
window.addEventListener('DOMContentLoaded', () => {
    new MatchThreeGame();
});