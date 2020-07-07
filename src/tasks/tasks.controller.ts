import { Controller, Get, Post, Body, Param, Delete, Patch, Query, UsePipes, ValidationPipe, ParseIntPipe, UseGuards, Logger } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TaskStatus } from './task-status.enum';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTaskFilterDto } from './dto/get-tasks-filter.dto';
import { TaskStatusValidationPipe } from './pipes/task-status-validation.pipes';
import { Task } from './task.entity';
import { DeleteResult } from 'typeorm';
import { AuthGuard } from '@nestjs/passport';
import { User } from 'src/auth/user.entity';
import { GetUser } from 'src/auth/get-user.decorator';

@Controller('tasks')
@UseGuards(AuthGuard())
export class TasksController {
  private logger = new Logger('TasksController')
  //para importar um provider marcado com inject controller marcamos no construtor
  //serviço fica disponível pelo this
  constructor(private tasksService:TasksService){}

  @Get()
  getTasks(@Query(ValidationPipe) filterDto:GetTaskFilterDto,
  @GetUser() user:User):Promise<Task[]>{
    this.logger.verbose(`User ${user.username} retrieving all tasks.Filters: ${JSON.stringify(filterDto)}`)
    return this.tasksService.getTasks(filterDto,user)
  }

  @Get('/:id')
  getTaskById(@Param('id',ParseIntPipe) id:number,
  @GetUser() user:User):Promise<Task>{
    return this.tasksService.getTaskById(id,user)
  }

  // @Post()
  // createTask(
  // @Body('title') title:string,
  // @Body('description') description:string
  // ):Task{
  //   return this.tasksService.createTask(title,description)
   
  // // }
  // //no exemplo acima a função createtask sem DTO e abaixo com
  @Post()
  @UsePipes(ValidationPipe)
  createTask(@Body() createTaskDto:CreateTaskDto,
  @GetUser() user:User):Promise<Task>{
    this.logger.verbose(`User ${user.username} creating a new task.DATA:${JSON.stringify(createTaskDto)}`)
    return this.tasksService.createTask(createTaskDto,user)
  
  }

  @Delete('/:id')
  deleteTask(@Param('id',ParseIntPipe) id:number,
  @GetUser() user:User):void{
     this.tasksService.deleteTask(id,user)
  }

  @Patch('/:id/status')
  updateTask(@Param('id',ParseIntPipe) id:number,@Body('status',TaskStatusValidationPipe) status:TaskStatus,
  @GetUser() user:User):Promise<Task>
  {
    return this.tasksService.updateTaskStatus(id,status,user)
  }
}
