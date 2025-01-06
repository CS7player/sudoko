import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterTestingHarness } from '@angular/router/testing';

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './game.component.html',
  styleUrl: './game.component.css'
})
export class GameComponent implements OnInit {
  ngOnInit(): void {
    this.generateSudoku(1)
  }
  mistake_count : number = 0;
  totalSeconds: number = 0; 
  private intervalId: any = null;
  level = [1,2,3,4,5,6,7]
  normal = [1,2,3,4,5,6,7,8,9];
  orgData : any = [];
  validData : any = [];
  leveler : number = 1;
  gamedata:any = [
    [0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0,0]
  ]
  startTimer() {
    if (this.intervalId) {
      return; 
    }
    this.intervalId = setInterval(() => {
      this.totalSeconds += 1; 
    }, 1000); 
  }
  stopTimer() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }
  resetTimer() {
    this.stopTimer();
    this.totalSeconds = 0;
  }
  formatTime(): string {
    const minutes = Math.floor(this.totalSeconds / 60);
    const seconds = this.totalSeconds % 60;
    return `${minutes}.${seconds < 10 ? '0' + seconds : seconds}`;
  }
  levelChanger(){
    this.generateSudoku(this.leveler);
  }
  generateSudoku(level : number): number[][] {
    const grid: number[][] = Array.from({ length: 9 }, () => Array(9).fill(0));
    const shuffle = (array: number[]): number[] => {
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
      }
      return array;
    };
    const isSafe = (grid: number[][], row: number, col: number, num: number): boolean => {
      for (let x = 0; x < 9; x++) {
        if (grid[row][x] === num) {
          return false;
        }
      }
      for (let x = 0; x < 9; x++) {
        if (grid[x][col] === num) {
          return false;
        }
      }
      const startRow = row - (row % 3);
      const startCol = col - (col % 3);
      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
          if (grid[startRow + i][startCol + j] === num) {
            return false;
          }
        }
      }
      return true;
    };
    const fillGrid = (): boolean => {
      for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
          if (grid[row][col] === 0) {
            const numbers = shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]);
            for (const num of numbers) {
              if (isSafe(grid, row, col, num)) {
                grid[row][col] = num;
  
                if (fillGrid()) {
                  return true;
                }
                grid[row][col] = 0;
              }
            }
            return false;
          }
        }
      }
      return true;
    };
    fillGrid();
    this.orgData = JSON.parse(JSON.stringify(grid));
    const removeNumbers = (grid: number[][], numToRemove: number): void => {
      let removed = 0;
      while (removed < numToRemove) {
        const row = Math.floor(Math.random() * 9);
        const col = Math.floor(Math.random() * 9);
        if (grid[row][col] !== 0) {
          grid[row][col] = 0;
          removed++;
        }
      }
    };
    let num = level * 9;
    removeNumbers(grid,num);
    this.validData = JSON.parse(JSON.stringify(grid));
    this.gamedata = [...grid];
    return grid;
  }
  points : any = [];
  test(i: number,j: number){
    if(this.points.length > 0){
      this.gamedata[this.points[0]][this.points[1]] = this.gamedata[this.points[0]][this.points[1]] == '@' ? 0 : this.gamedata[this.points[0]][this.points[1]];
    }
    this.points = [i,j];
    if(this.gamedata[i][j] == 0){
      this.gamedata[i][j] = '@'
    }
  }

  valid(i: number,j: number){
    if(this.validData[i][j] != 0){
      return true
    }
    return false;
  }

  classCreator(i: number, j:number) {
    const baseClass = 'btn';
    const classes = [baseClass];
    if (this.gamedata[i][j] === '@') {
      classes.push('highlight');
    }
    if(this.validData[i][j]==0){
      if(this.gamedata[i][j] === this.orgData[i][j]){
        classes.push('correct');
      }else{
        classes.push('wrong')
      }
    }
    return classes.join(' ');
  }
  
  selected(num : number){
    if(this.points.length>0){
      this.gamedata[this.points[0]][this.points[1]] = num;
      if(this.gamedata[this.points[0]][this.points[1]] != this.orgData[this.points[0]][this.points[1]]){
        this.mistake_count = this.mistake_count +1;
        if(this.mistake_count>5){
          alert('YOu loSe!!!')
          this.generateSudoku(this.leveler);
          this.mistake_count = 0;
        }
      }
    }
    this.winAlert()
  }

  winAlert(){
    for(let i=0;i<this.orgData.length;i++){
      for(let j=0;j<this.orgData[i].length;j++){
        if(this.orgData[i][j]!=this.gamedata[i][j]){
          return
        }
      }
    }
    alert('you Win The Game!!!');
    let status = confirm("Do u WanT to IncrEase the LeVEl???")
    this.leveler = status? this.leveler+1: this.leveler;
    this.generateSudoku(this.leveler);
    this.mistake_count = 0;
  }
  
}
