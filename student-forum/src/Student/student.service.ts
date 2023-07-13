import {
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  Res,
} from '@nestjs/common';
import {
  ForgetPassStudentDto,
  PasswordChangeStudentDto,
  StudentDto,
} from './dto/Student.dto';
import { StudentLoginDto } from './dto/StudentLogin.dto';
import { PostDto } from '../Post/dto/post.dto';
import { UpdateStudentDto } from './dto/updateStudent.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Student } from 'src/Db/student.entity';
import { Repository } from 'typeorm';
import { Post } from 'src/Db/post.entity';
import { UpdatePostDto } from 'src/Post/dto/updatePost.dto';
import * as bcrypt from 'bcrypt';
import e from 'express';
import { log } from 'console';
import { CommentDto } from 'src/Comment/dto/comment.dto';
import { Comment } from 'src/Db/comment.entity';
import { connect } from 'http2';
import { Hr } from 'src/Db/hiring.entity';
import { ReportDto } from 'src/Report/dto/report.dto';
import { Report } from 'src/Db/report.entity';
import { ApplyDto } from './dto/apply.dto';
import { StudentHr } from 'src/Db/student_hr.entity';

@Injectable()
export class StudentService {
  async deleteStudent(email: string): Promise<any> {
    const res = await this.studentRepo.delete({ email: email });

    if (res) {
      return res;
    } else {
      throw new NotFoundException({
        status: HttpStatus.NOT_FOUND,
        message: 'There is something wrong',
      });
    }
  }
  async getNetwork(email: string): Promise<any> {
    const std = await this.studentRepo.find({
      where: { email: email },
      relations: {
        sthr: true,
      },
    });

    if (std) {
      return std;
    } else {
      throw new NotFoundException({
        status: HttpStatus.NOT_FOUND,
        message: 'There is something wrong',
      });
    }
  }
  async addApply(id: number, email: string) {
    const std = await this.studentRepo.findOneBy({ email: email });

    if (std) {
      std.job = id;
      return await this.studentRepo.update(std.id, std);
    } else {
      throw new NotFoundException({
        status: HttpStatus.NOT_FOUND,
        message: 'There is something wrong',
      });
    }
  }
  async addReport(data: ReportDto, email: string) {
    const student = await this.studentRepo.findOneBy({ email: email });
    if (student) {
      data.student = student.id;

      const res = await this.reportRepo.save(data);

      if (res) {
        return res;
      } else {
        throw new InternalServerErrorException({
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'There is something wrong',
        });
      }
    } else {
      throw new InternalServerErrorException({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'There is something wrong',
      });
    }
  }
  async createNetwork(id: number, email: string) {
    const std = await this.studentRepo.findOneBy({ email: email });

    if (std) {
      const hr = await this.hrRepo.findOneBy({ id: id });

      const ex = await this.studentHrRepo.findOneBy({ student: std, hr: hr });
      if (!ex) {
        return await this.studentHrRepo.save({ student: std, hr: hr });
      } else {
        throw new NotFoundException({
          status: HttpStatus.NOT_FOUND,
          message: 'There is something wrong',
        });
      }
    } else {
      throw new NotFoundException({
        status: HttpStatus.NOT_FOUND,
        message: 'There is something wrong',
      });
    }
  }
  async getReplyComment(id: number, email: string): Promise<any> {
    const std = await this.studentRepo.findOneBy({ email: email });
    console.log(std);
    if (std) {
      const res = await this.commentRepo.find({
        where: { id: id },
        relations: {
          childComments: true,
        },
      });

      if (res) {
        return res;
      } else {
        throw new NotFoundException({
          status: HttpStatus.NOT_FOUND,
          message: 'There is something wrong',
        });
      }
    } else {
      throw new NotFoundException({
        status: HttpStatus.NOT_FOUND,
        message: 'There is something wrong',
      });
    }
  }
  async addReplyComment(
    id: number,
    data: CommentDto,
    email: string,
  ): Promise<any> {
    const student = await this.studentRepo.findOneBy({ email: email });
    if (student) {
      data.student = student.id;
      data.parentComment = id;
      const res = await this.commentRepo.save(data);

      if (res) {
        return res;
      } else {
        throw new InternalServerErrorException({
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'There is something wrong',
        });
      }
    }
  }
  async deleteComment(id: number, email: string): Promise<any> {
    const res = await this.studentRepo.findOneBy({ email: email });
    if (res) {
      const com = await this.commentRepo.delete(id);
      return com;
    } else {
      throw new NotFoundException({
        status: HttpStatus.NOT_FOUND,
        message: 'There is something wrong',
      });
    }
  }
  async getPostComment(id: number, email: string): Promise<any> {
    const std = await this.studentRepo.findOneBy({ email: email });
    if (std) {
      const res = await this.postRepo.find({
        where: { id: id },
        relations: {
          comments: { childComments: true },
        },
      });
      if (res) {
        return res;
      } else {
        throw new NotFoundException({
          status: HttpStatus.NOT_FOUND,
          message: 'There is something wrong',
        });
      }
    } else {
      throw new NotFoundException({
        status: HttpStatus.NOT_FOUND,
        message: 'There is something wrong',
      });
    }
  }
  constructor(
    @InjectRepository(Student) private studentRepo: Repository<Student>,
    @InjectRepository(Post) private postRepo: Repository<Post>,
    @InjectRepository(Comment) private commentRepo: Repository<Comment>,
    @InjectRepository(Hr) private hrRepo: Repository<Hr>,
    @InjectRepository(Report) private reportRepo: Repository<Report>,

    @InjectRepository(StudentHr) private studentHrRepo: Repository<StudentHr>,
  ) {}

  async addComment(id: number, data: CommentDto, email: string): Promise<any> {
    const student = await this.studentRepo.findOneBy({ email: email });
    if (student) {
      data.student = student.id;
      data.post = id;
      const res = await this.commentRepo.save(data);

      if (res) {
        return res;
      } else {
        throw new InternalServerErrorException({
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'There is something wrong',
        });
      }
    }
  }
  async getDetailsPost(id: number, email: any): Promise<any> {
    const std = await this.studentRepo.findOneBy({ email: email });

    if (std) {
      const res = await this.postRepo.findOneBy({ id: id });
      if (res) {
        return res;
      } else {
        throw new NotFoundException({
          status: HttpStatus.NOT_FOUND,
          message: 'Post Not Found',
        });
      }
    } else {
      throw new NotFoundException({
        status: HttpStatus.NOT_FOUND,
        message: 'There is something wrong',
      });
    }
  }
  async getAllPost(email: string): Promise<Post[]> {
    const res = await this.postRepo.find();

    if (res) {
      return res;
    } else {
      throw new NotFoundException({
        status: HttpStatus.NOT_FOUND,
        message: 'There is something wrong',
      });
    }
  }

  async deletePostByStudentId(id: number, email: string): Promise<any> {
    const stud = await this.studentRepo.findOneBy({ email: email });

    if (stud) {
      const res = await this.postRepo.delete({ id: id, student: stud.id });

      return res;
    } else {
      throw new NotFoundException({
        status: HttpStatus.NOT_FOUND,
        message: 'Not found the post',
      });
    }
  }
  async getMyPost(email: string): Promise<any> {
    const res = await this.studentRepo.find({
      where: { email: email },
      relations: {
        posts: true,
      },
    });

    if (res) {
      return res;
    } else {
      throw new NotFoundException({
        status: HttpStatus.NOT_FOUND,
        message: 'There is something wrong',
      });
    }
  }
  async updatePost(
    id: number,
    data: UpdatePostDto,
    email: string,
  ): Promise<any> {
    const stud = await this.studentRepo.findOneBy({ email: email });

    if (stud) {
      data.updatedDate = new Date();
      const res = await this.postRepo.update(
        { id: id, student: stud.id },
        data,
      );

      return res;
    } else {
      throw new NotFoundException({
        status: HttpStatus.NOT_FOUND,
        message: 'Not found the post',
      });
    }
  }

  forgetpassword(id: number, student: ForgetPassStudentDto): any {
    return '';
  }
  async passwordChange(
    changedPass: PasswordChangeStudentDto,
    email: string,
  ): Promise<any> {
    const student = await this.studentRepo.findOneBy({
      email: email,
    });
    const isMatch: boolean = await bcrypt.compare(
      changedPass.oldPassword,
      student.password,
    );

    if (isMatch) {
      const salt = await bcrypt.genSalt();
      student.password = await bcrypt.hash(changedPass.newPassword, salt);
      const res = await this.studentRepo.update(student.id, student);

      return res;
    } else {
      throw new NotFoundException({
        status: HttpStatus.NOT_FOUND,
        message: 'Not found the user',
      });
    }
  }

  async addPost(data: PostDto, email: string): Promise<any> {
    const student = await this.studentRepo.findOneBy({ email: email });
    if (student) {
      data.createdDate = new Date();
      data.updatedDate = new Date();
      data.student = student.id;
      console.log(data.student); //don't ever use studentId instead of student, bcz in database there is already a studentId. we have to cut Id
      const res = await this.postRepo.save(data);

      if (res) {
        return res;
      } else {
        throw new InternalServerErrorException({
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          message: 'There is something wrong',
        });
      }
    }
  }
  getDashboard(): any {
    return '';
  }
  deleteProfile(id: number): any {
    return '';
  }
  async editProfile(student: UpdateStudentDto, email: string): Promise<any> {
    const res = await this.studentRepo.update({ email: email }, student);

    if (res) {
      return res;
    } else {
      throw new NotFoundException({
        status: HttpStatus.NOT_FOUND,
        message: 'User not found',
      });
    }
  }
  async myProfile(email: string): Promise<Student> {
    const student = await this.studentRepo.findOneBy({ email: email });

    if (student) {
      return student;
    } else {
      throw new NotFoundException({
        status: HttpStatus.NOT_FOUND,
        message: 'Not found the user',
      });
    }
  }
  async loginStudent(student: StudentLoginDto): Promise<any> {
    const res = await this.studentRepo.findOneBy({ email: student.email });
    if (res) {
      const isMatch: boolean = await bcrypt.compare(
        student.password,
        res.password,
      );
      if (isMatch) return isMatch;
    } else {
      return false;
    }
  }

  async addStudent(student: StudentDto): Promise<any> {
    const salt = await bcrypt.genSalt();
    student.password = await bcrypt.hash(student.password, salt);

    const res = await this.studentRepo.save(student);

    if (res) {
      return res;
    } else {
      throw new InternalServerErrorException({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'There is something wrong',
      });
    }
  }

  async getImages(@Res() res, email: string): Promise<void> {
    const admin = await this.studentRepo.findOneBy({ email: email });

    if (admin) {
      res.sendFile(admin.profileImg, { root: './uploads/student' });
    } else {
      throw new NotFoundException({
        status: HttpStatus.NOT_FOUND,
        message: 'There is something wrong',
      });
    }
  }
}
