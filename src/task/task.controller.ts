import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { CookieGetter } from './../decorators/cookieGetter';
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  UseGuards,
} from '@nestjs/common';
import { TaskService } from './task.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { AuthGuard } from '../guards/jwt-auth.guard';
import { RequestGet } from '../decorators/request-getter.decorator';
import { UserReq } from './types/user.type';

@ApiTags('Task')
@Controller('task')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Create a new task' })
  @Post('/add')
  create(@Body() createTaskDto: CreateTaskDto, @RequestGet() user: UserReq) {
    return this.taskService.createNewTask(createTaskDto, user);
  }

  @ApiOperation({ summary: 'Get all tasks' })
  @Get('/all')
  findAll(@CookieGetter('refresh_token') refreshToken: string) {
    return this.taskService.findAllTasks(refreshToken);
  }

  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Get a task by ID' })
  @ApiParam({ name: 'id', description: 'Task ID' })
  @Get('/:id')
  findOne(@Param('id') id: string, @RequestGet() user: UserReq) {
    return this.taskService.findOneTask(id, user);
  }

  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Update a task by ID' })
  @ApiParam({ name: 'id', description: 'Task ID' })
  @Put('/update/:id')
  update(
    @Param('id') id: string,
    @Body() updateTaskDto: UpdateTaskDto,
    @RequestGet() user: UserReq,
  ) {
    return this.taskService.updateTask(id, updateTaskDto, user);
  }

  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Delete a task by ID' })
  @ApiParam({ name: 'id', description: 'Task ID' })
  @Delete('/delete/:id')
  remove(@Param('id') id: string, @RequestGet() user: UserReq) {
    return this.taskService.removeTask(id, user);
  }
}
