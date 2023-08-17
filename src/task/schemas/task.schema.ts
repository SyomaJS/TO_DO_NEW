import { ApiProperty, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Date, HydratedDocument, Types } from 'mongoose';
import { User } from '../../user/schemas/user.schema';

export type TaskDocument = HydratedDocument<Task>;

@Schema({ versionKey: false })
@ApiTags('tasks')
export class Task {
  @ApiProperty({
    type: () => User,
    description: 'The user associated with the task',
  })
  @Prop({ required: false, type: Types.ObjectId, ref: 'User' })
  userId: User;

  @ApiProperty({
    description: 'The name of the task',
    example: 'Complete Project Report',
  })
  @Prop({ required: true })
  taskName: string;

  @ApiProperty({
    description: 'The name of the project the task belongs to',
    example: 'Project X',
  })
  @Prop({ required: true })
  projectName: string;

  @ApiProperty({
    description: 'The start date of the task',
    example: '2023-08-17T10:00:00Z',
  })
  @Prop({ required: true, type: Date })
  startDate: Date;

  @ApiProperty({
    description: 'The end date of the task',
    example: '2023-08-20T15:30:00Z',
  })
  @Prop({ type: Date })
  endDate: Date;

  @ApiProperty({
    description: 'The category of the task',
    example: 'Development',
  })
  @Prop({ required: true })
  category: string;

  @ApiProperty({
    description: 'The status of the task',
    example: 'In Progress',
  })
  @Prop({ required: true })
  taskStatus: string;

  @ApiProperty({
    description: 'The current step of the task',
    example: 'Design Phase',
  })
  @Prop()
  taskStep: string;
}

export const TaskSchema = SchemaFactory.createForClass(Task);
