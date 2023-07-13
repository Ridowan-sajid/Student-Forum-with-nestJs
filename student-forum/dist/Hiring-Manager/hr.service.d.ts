import { ForgetPassHrDto, HrDto, HrLoginDto, PasswordChangeHrDto } from './dto/hr.dto';
import { JobDto } from 'src/Job/dto/job.dto';
import { UpdateJobDto } from 'src/Job/dto/updateJob.dto';
import { Hr } from 'src/Db/hiring.entity';
import { Repository } from 'typeorm';
import { Job } from 'src/Db/job.entity';
import { Post } from 'src/Db/post.entity';
import { OfferDTO } from 'src/OfferLetter/dto/offer.dto';
import { Student } from 'src/Db/student.entity';
import { Offer } from 'src/Db/offer.entity';
import { CommentDto } from 'src/Comment/dto/comment.dto';
import { Comment } from 'src/Db/comment.entity';
import { UpdateHrDto } from './dto/updatehr.dto';
export declare class HrService {
    private hrRepo;
    private jobRepo;
    private postRepo;
    private studentRepo;
    private offerRepo;
    private commentRepo;
    deleteHr(email: string): Promise<any>;
    getAllCandidate(id: number, email: string): Promise<any>;
    addLetter(id: number, data: OfferDTO, email: string): Promise<OfferDTO & Offer>;
    getAllPost(email: string): Promise<Post[]>;
    getAllJob(email: string): Promise<Job[]>;
    getJobDetails(id: number, email: string): Promise<any>;
    constructor(hrRepo: Repository<Hr>, jobRepo: Repository<Job>, postRepo: Repository<Post>, studentRepo: Repository<Student>, offerRepo: Repository<Offer>, commentRepo: Repository<Comment>);
    deleteJob(id: number, email: string): Promise<import("typeorm").DeleteResult>;
    forgetpassword(id: number, data: ForgetPassHrDto): any;
    passwordChange(data: PasswordChangeHrDto, email: string): Promise<any>;
    deleteProfile(id: number): any;
    editProfile(data: UpdateHrDto, email: string): Promise<any>;
    myProfile(email: string): Promise<Hr>;
    dashboard(): any;
    loginHr(hr: HrLoginDto): Promise<any>;
    addHr(hr: HrDto): Promise<any>;
    addJob(data: JobDto, email: string): Promise<JobDto & Job>;
    deleteJobByHrId(id: number, email: string): Promise<any>;
    getJobByHrId(email: string): Promise<any>;
    updateJob(id: number, data: UpdateJobDto, email: string): Promise<any>;
    addComment(id: number, data: CommentDto, email: string): Promise<any>;
    getPostComment(id: number, email: string): Promise<any>;
    deleteComment(id: number, email: string): Promise<any>;
    addReplyComment(id: number, data: CommentDto, email: string): Promise<any>;
    getReplyComment(id: number, email: string): Promise<any>;
    getImages(res: any, email: string): Promise<void>;
}
