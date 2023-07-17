import { ForgetPassModeratorDto, ModeratorDto, ModeratorLoginDto, PasswordChangeModeratorDto } from './dto/Moderator.dto';
import { UpdateModeratorDto } from './dto/updateModerator.dto';
import { Repository } from 'typeorm';
import { Moderator } from 'src/Db/moderator.entity';
import { Student } from 'src/Db/student.entity';
import { StudentDto } from 'src/Student/dto/Student.dto';
import { UpdateStudentDto } from 'src/Student/dto/updateStudent.dto';
import { ModeratorProfile } from 'src/Db/moderatorProfile.dto';
import { Post } from 'src/Db/post.entity';
import { Report } from 'src/Db/report.entity';
import { Comment } from 'src/Db/comment.entity';
import { Hr } from 'src/Db/hiring.entity';
import { Token } from 'src/Db/token.entity';
import { MailerService } from '@nestjs-modules/mailer';
export declare class ModeratorService {
    private moderatorRepo;
    private studentRepo;
    private moderatorProfileRepo;
    private postRepo;
    private reportRepo;
    private commentRepo;
    private hrRepo;
    private tokenRepo;
    private mailService;
    constructor(moderatorRepo: Repository<Moderator>, studentRepo: Repository<Student>, moderatorProfileRepo: Repository<ModeratorProfile>, postRepo: Repository<Post>, reportRepo: Repository<Report>, commentRepo: Repository<Comment>, hrRepo: Repository<Hr>, tokenRepo: Repository<Token>, mailService: MailerService);
    getHrComment(id: number, email: any): Promise<any>;
    getStudentComment(id: number, email: any): Promise<any>;
    getHrJobs(id: number, email: any): Promise<any>;
    getStudentPost(id: number, email: any): Promise<any>;
    allReport(email: any): Promise<any>;
    deleteComment(id: number, email: any): Promise<any>;
    allPostComment(id: number, email: string): Promise<any>;
    allPost(email: string): Promise<any>;
    reportHandling(id: number, email: string): Promise<any>;
    deletePost(id: number, email: any): Promise<any>;
    deleteStudentByModeratorId(id: number, email: string): Promise<any>;
    updateStudentByModeratorId(id: number, student: UpdateStudentDto, email: string): Promise<any>;
    getStudentByModeratorId(id: number): Promise<any>;
    addStudent(student: StudentDto, email: string): Promise<Student>;
    passwordChange(changedPass: PasswordChangeModeratorDto, email: string): Promise<any>;
    deleteProfile(email: string): Promise<any>;
    editProfile(moderator: UpdateModeratorDto, email: string): Promise<any>;
    myProfile(email: string): Promise<ModeratorProfile>;
    loginModerator(moderator: ModeratorLoginDto): Promise<any>;
    addModerator(moderator: ModeratorDto): Promise<any>;
    getImages(res: any, email: string): Promise<void>;
    ForgetPassword(email: string): Promise<void>;
    newPassword(data: ForgetPassModeratorDto): Promise<import("typeorm").UpdateResult>;
}
