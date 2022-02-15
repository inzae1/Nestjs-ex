import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateBoardDto } from './dto/create-board.dto';
import { v1 as uuid } from 'uuid';
import { InjectRepository } from '@nestjs/typeorm';
import { BoardRepository } from './board.repository';
import { Board } from './board.entity';
import { BoardStatus } from './board.model';

@Injectable()
export class BoardsService {
  // Inject Repository to Service
  constructor(
    @InjectRepository(BoardRepository)
    private boardRepository: BoardRepository,
  ) {}

  // 게시물 만들기
  async createBoard(createBoardDto: CreateBoardDto): Promise<Board> {
    return this.boardRepository.createBoard(createBoardDto);
  }

  // ID로 게시물 가져오기
  async getBoardById(id: number): Promise<Board> {
    const found = await this.boardRepository.findOne(id);

    if (!found) {
      throw new NotFoundException(`Can't find Board with id ${id}`);
    }

    return found;
  }

  // ID로 게시물 삭제하기
  async deleteBoard(id: number): Promise<void> {
    const result = await this.boardRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException(`Can't find Board with id ${id}`);
    }
  }

  // ID로 게시물 상태 수정하기
  async updateBoardStatus(id: number, status: BoardStatus): Promise<Board> {
    const board = await this.getBoardById(id);

    board.status = status;
    await this.boardRepository.save(board);

    return board;
  }
}

// // 모든 게시물 가져오기
// getAllBoards(): Board[] {
//   return this.boards;
// }
//
// // 게시물 만들기
// createBoard(createBoardDto: CreateBoardDto): Board {
//   const { title, description } = createBoardDto;
//
//   const board: Board = {
//     id: uuid(),
//     title,
//     description,
//     status: BoardStatus.PUBLIC,
//   };
//
//   this.boards.push(board);
//   return board;
// }

//   // ID로 게시물 지우기
//   deleteBoard(id: string): void {
//     const found = this.getBoardById(id);
//     this.boards = this.boards.filter((board) => board.id !== found.id);
//   }
//
//   // ID로 상태업데이트
//   updateBoardStatus(id: string, status: BoardStatus): Board {
//     const board = this.getBoardById(id);
//     board.status = status;
//     return board;
//   }
// }
