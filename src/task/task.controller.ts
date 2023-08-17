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
} from '@nestjs/common';
import { TaskService } from './task.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@ApiTags('Task')
@Controller('task')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  @ApiOperation({ summary: 'Create a new task' })
  @Post('/add')
  create(
    @Body() createTaskDto: CreateTaskDto,
    @CookieGetter('refresh_token') refreshToken: string,
  ) {
    return this.taskService.createNewTask(createTaskDto, refreshToken);
  }

  @ApiOperation({ summary: 'Get all tasks' })
  @Get('/all')
  findAll(@CookieGetter('refresh_token') refreshToken: string) {
    return this.taskService.findAllTasks(refreshToken);
  }

  @ApiOperation({ summary: 'Get a task by ID' })
  @ApiParam({ name: 'id', description: 'Task ID' })
  @Get('/:id')
  findOne(@Param('id') id: string) {
    return this.taskService.findOneTask(id);
  }

  @ApiOperation({ summary: 'Update a task by ID' })
  @ApiParam({ name: 'id', description: 'Task ID' })
  @Put('/update/:id')
  update(@Param('id') id: string, @Body() updateTaskDto: UpdateTaskDto) {
    return this.taskService.updateTask(id, updateTaskDto);
  }

  @ApiOperation({ summary: 'Delete a task by ID' })
  @ApiParam({ name: 'id', description: 'Task ID' })
  @Delete('/delete/:id')
  remove(@Param('id') id: string) {
    return this.taskService.removeTask(id);
  }

  async func() {}
}
