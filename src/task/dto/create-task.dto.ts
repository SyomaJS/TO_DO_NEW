import { ApiProperty } from '@nestjs/swagger';

export class CreateTaskDto {
  @ApiProperty({ example: 'Complete Project Report' })
  taskName: string;

  @ApiProperty({ example: 'Quarterly Sales Analysis' })
  projectName: string;

  @ApiProperty({ example: '2023-08-16T09:00:00Z' })
  startDate: Date;

  @ApiProperty({ example: '2023-08-20T17:00:00Z' })
  endDate: Date;

  @ApiProperty({ example: 'Analysis' })
  category: string;

  @ApiProperty({ example: 'Gather data and generate insights' })
  taskStep: string;

  @ApiProperty({ example: 'in-progress' })
  taskStatus: string;
}
