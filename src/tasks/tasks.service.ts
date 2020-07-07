import { Injectable, NotFoundException } from '@nestjs/common';
import { TaskStatus } from './task-status.enum';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTaskFilterDto } from './dto/get-tasks-filter.dto';
import { TaskRepository } from './task.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './task.entity';
import { DeleteResult } from 'typeorm';
import { User } from 'src/auth/user.entity';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(TaskRepository)
    private taskRepository: TaskRepository
  ){}
  

  async getTasks(filterdto:GetTaskFilterDto,user:User):Promise<Task[]>{
    return this.taskRepository.getTasks(filterdto,user)
  }
  //private tasks :Task[]= [] comentado porque agora vai ser utilizando banco de dados

  // getAllTasks():Task []{
  //   return this.tasks;
  // }

  // getTaskWithFilters(filterdto:GetTaskFilterDto):Task[]{
  //   const {status,search}=filterdto;

  //   let tasks=this.getAllTasks();

  //   if (status){
  //     tasks = tasks.filter(task=>task.status===status)
  //   }
  //   if (search){
  //     tasks = tasks.filter(task=>
  //     task.title.includes(search) ||
  //     task.description.includes(search))
  //   }
  //   return tasks
  // }


  async getTaskById(id: number,user:User):Promise<Task>{
    const found = await this.taskRepository.findOne({where:{id,userId:user}});
    
    if(!found){
      throw new NotFoundException(`Task with ${id} not found`);
    }

    return found;

  }
  //metodo abaixo sem banco de dados
  // getTaskById(id:string):Task{
  //   const found= this.tasks.find(task=>task.id===id);

  //   if(!found){
  //     throw new NotFoundException(`Task with ${id} not found`);
  //   }
  //   return found;

  // }

  async createTask(createTaskDto:CreateTaskDto,user:User){
    return this.taskRepository.createTask(createTaskDto,user);
  }
  // // createTask(title:string,description:string):Task{
  // //   const task:Task = {
  // //     id:uuid(),
  // //     title,
  // //     description,
  // //     status:TaskStatus.OPEN,
  // //   };

  // //   this.tasks.push(task);
  // //   return task;
  // // }
  // //exemplo acima sem DTO e abaixo com
  // createTask(createTaskDto:CreateTaskDto):Task{
  //   const {title,description} = createTaskDto;

  //   const task:Task = {
  //     id:uuid(),
  //     title,
  //     description,
  //     status:TaskStatus.OPEN,
  //   };

  //   this.tasks.push(task);
  //   return task;
  // }

    async deleteTask(id:number,user:User):Promise<void>{
      const result = await this.taskRepository.delete({id,userId:user.id})

      if(result.affected === 0){
        throw new NotFoundException(`Task with ${id} not found`);
      }      
    }
  // deleteTask(id:string):void{
  //   const found =  this.getTaskById(id)
  //   this.tasks=this.tasks.filter(task=>task.id !== found.id)
  // }

  async updateTaskStatus(id:number,
    status:TaskStatus,
    user:User):Promise<Task>{
    const task = await this.getTaskById(id,user)
    task.status=status;
    await task.save();

    return task;
  }

  // updateTask(id:string,status:TaskStatus):Task{
  //   // const index = this.tasks.findIndex(task=>task.id==id)
  //   // this.tasks[index][item]=value
  //   // return this.tasks[index]
  //   const task = this.getTaskById(id)
  //   task.status=status
  //   return task
  // }
}
