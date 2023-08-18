import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Task, TaskDocument } from './schemas/task.schema';
import { Model, isValidObjectId } from 'mongoose';

@Injectable()
export class TaskService {
  constructor(
    @InjectModel(Task.name) private readonly taskModel: Model<TaskDocument>,
    private readonly jwtService: JwtService,
  ) {}
  async createNewTask(createTaskDto: CreateTaskDto, token: string) {
    const decoded = this.jwtService.decode(token);
    const userId = decoded['id'];
    const newTasak = await this.taskModel.create({
      ...createTaskDto,
      userId: userId,
    });
    if (!newTasak)
      throw new InternalServerErrorException(
        'An error occurred while creating task',
      );

    return newTasak;
  }

  async findAllTasks(token) {
    const decoded = this.jwtService.decode(token);
    const userId = decoded['id'];
    const tasks = await this.taskModel.find({ user: userId });
    return tasks;
  }

  async findOneTask(id: string) {
    if (!isValidObjectId(id)) throw new BadRequestException('Invalid ID');
    const task = await this.taskModel.findOne({ _id: id });
    if (!task) throw new NotFoundException('Task is not found');
    return task;
  }

  async updateTask(id: string, updateTaskDto: UpdateTaskDto) {
    if (!isValidObjectId(id)) throw new BadRequestException('Invalid ID');
    const updatedOne = await this.taskModel.findOneAndUpdate(
      { _id: id },
      updateTaskDto,
      { new: true },
    );

    if (!updatedOne)
      throw new NotFoundException('Task with such ID is not found');

    return updatedOne;
  }

  async removeTask(id: string) {
    if (!isValidObjectId(id)) throw new BadRequestException('Invalid ID');
    const task = await this.taskModel.findOneAndDelete({ _id: id });
    if (!task) throw new NotFoundException('Task with such ID is not found');

    return { message: 'Successfully deleted', taskId: task._id };
  }
}
