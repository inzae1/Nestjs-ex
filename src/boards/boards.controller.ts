import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { BoardsService } from './boards.service';
import { CreateBoardDto } from './dto/create-board.dto';
import { BoardStatusValidationPipe } from './pipes/board-status-validation.pipe';
import { Board } from './board.entity';
import { BoardStatus } from './board.model';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from '../auth/get-user.decorator';
import { User } from '../auth/user.entity';

@Controller('boards')
@UseGuards(AuthGuard())
export class BoardsController {
  private logger = new Logger('BoardsController');

  constructor(private boardsService: BoardsService) {}

  @Get()
  getAllBoards(@GetUser() user: User): Promise<Board[]> {
    this.logger.verbose(`User "${user.username} trying to get all boards`);
    return this.boardsService.getAllBoards();
  }

  @Post()
  @UsePipes(ValidationPipe)
  createBoard(
    @Body() createBoardDto: CreateBoardDto,
    @GetUser() user: User,
  ): Promise<Board> {
    this.logger.verbose(`User "${user.username}" creating a new board.
    Payload: ${JSON.stringify(createBoardDto)}`);
    return this.boardsService.createBoard(createBoardDto, user);
  }

  @Get('/:id')
  getBoardById(@Param('id') id: number, @GetUser() user: User): Promise<Board> {
    return this.boardsService.getBoardById(id, user);
  }

  @Delete('/:id')
  deleteBoard(@Param('id') id: number, @GetUser() user: User): Promise<void> {
    return this.boardsService.deleteBoard(id, user);
  }

  @Patch('/:id/status')
  updateBoardStatus(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() user: User,
    @Body('status', BoardStatusValidationPipe) status: BoardStatus,
  ): Promise<Board> {
    return this.boardsService.updateBoardStatus(id, user, status);
  }
}

// @Get()
// getAllTask(): Board[] {
//   return this.boardsService.getAllBoards();
// }
//
// @Post()
// @UsePipes(ValidationPipe)
// createBoard(@Body() CreateBoardDto: CreateBoardDto): Board {
//   return this.boardsService.createBoard(CreateBoardDto);
// }
//
// @Get('/:id')
// getBoardById(@Param('id') id: number): Promise<Board> {
//   return this.boardsService.getBoardById(id);
// }
//
// @Delete('/:id')
// deleteBoard(@Param('id') id: string): void {
//   this.boardsService.deleteBoard(id);
// }
//
// @Patch('/:id/status')
// updateBoardStatus(
//   @Param('id') id: string,
//   @Body('status', BoardStatusValidationPipe) status: BoardStatus,
// ) {
//   return this.boardsService.updateBoardStatus(id, status);
