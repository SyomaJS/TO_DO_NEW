import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Task, TaskDocument } from './schemas/task.schema';
import { Model, isValidObjectId } from 'mongoose';
import { UserReq } from './types/user.type';

@Injectable()
export class TaskService {
  constructor(
    @InjectModel(Task.name) private readonly taskModel: Model<TaskDocument>,
    private readonly jwtService: JwtService,
  ) {}
  async createNewTask(createTaskDto: CreateTaskDto, user: UserReq) {
    if (!user)
      throw new ForbiddenException('User is not allowed to create new task');

    const newTasak = await this.taskModel.create({
      ...createTaskDto,
      userId: user.id,
    });
    if (!newTasak)
      throw new InternalServerErrorException(
        'An error occurred while creating task',
      );

    return newTasak;
  }

  async findAllTasks(token: string) {
    const decoded = this.jwtService.decode(token);
    const userId = decoded['id'];
    const tasks = await this.taskModel.find({ userId: userId });
    return tasks;
  }

  async findOneTask(id: string, user: UserReq) {
    if (!isValidObjectId(id)) throw new BadRequestException('Invalid ID');
    if (!user) throw new ForbiddenException('User not authorized');

    const task = await this.taskModel.findOne({ _id: id, userId: user.id });
    if (!task) throw new NotFoundException('Task is not found');
    return task;
  }

  async updateTask(id: string, updateTaskDto: UpdateTaskDto, user: UserReq) {
    if (!isValidObjectId(id)) throw new BadRequestException('Invalid ID');
    if (!user) throw new ForbiddenException('User not authorized');

    const updatedOne = await this.taskModel.findOneAndUpdate(
      { _id: id, userId: user.id },
      updateTaskDto,
      { new: true },
    );

    if (!updatedOne)
      throw new NotFoundException('Task with such ID is not found');

    return updatedOne;
  }

  async removeTask(id: string, user: UserReq) {
    if (!isValidObjectId(id)) throw new BadRequestException('Invalid ID');
    if (!user) throw new ForbiddenException('User not authorized');
    const task = await this.taskModel.findOneAndDelete({
      _id: id,
      userId: user.id,
    });
    if (!task) throw new NotFoundException('Task with such ID is not found');

    return { message: 'Successfully deleted', taskId: task._id };
  }
}
