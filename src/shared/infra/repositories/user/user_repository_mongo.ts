import { DuplicatedItem, NoItemsFound } from "src/shared/helpers/errors/usecase_errors";
import { User } from "../../../domain/entities/user";
import { IUserRepository } from "../../../domain/irepositories/user_repository_interface";
import { connectDB } from "../../database/models";
import { IUser } from "../../database/models/user.model";
import { UserMongoDTO } from "../../database/dtos/user_mongo_dto"
import { v4 as uuidv4 } from 'uuid';
import { GetProfileReturnType } from "src/shared/helpers/types/get_profile_return_type";
import { PRIVACY_TYPE } from "src/shared/domain/enums/privacy_enum";
import { FindPersonReturnType } from "src/shared/helpers/types/find_person_return_type";

export class UserRepositoryMongo implements IUserRepository { 
  async createUser(user: User): Promise<User> {
    try {
      const db = await connectDB();
      db.connections[0].on('error', () => {
        console.error.bind(console, 'connection error:')
        throw new Error('Error connecting to MongoDB');
      });

      const userMongoClient = db.connections[0].db?.collection<IUser>('User');

      const dto = UserMongoDTO.fromEntity(user);
      const userDoc = UserMongoDTO.toMongo(dto);

      console.log('MONGO REPO USER DOC: ', userDoc);

      userDoc._id = uuidv4();

      const userAlreadyExists = await userMongoClient?.findOne({ email: user.userEmail });

      if (userAlreadyExists) {
        throw new DuplicatedItem('email');
      }

      const respMongo = await userMongoClient?.insertOne(userDoc);
      console.log('MONGO REPO USER RESPMONGO: ', respMongo);
      console.log('MONGO REPO USER CREATED: ', user);

      return user;
    } catch (error) {
      throw new Error(`Error creating user on MongoDB: ${error}`);
    } finally {
      
    }
  }

  async updateProfilePhoto(email: string, profilePhotoUrl: string): Promise<string> {
    try {
      const db = await connectDB();
      db.connections[0].on('error', () => {
        console.error.bind(console, 'connection error:')
        throw new Error('Error connecting to MongoDB');
      });

      const userMongoClient = db.connections[0].db?.collection<IUser>('User');

      const userDoc = await userMongoClient?.findOne({ email });

      if (!userDoc) {
        throw new NoItemsFound('email');
      }

      userDoc.profile_photo = profilePhotoUrl;

      const respMongo = await userMongoClient?.updateOne({ email }, { $set: userDoc });
      console.log('MONGO REPO USER RESPMONGO: ', respMongo);

      return profilePhotoUrl;

    } catch (error) {
      throw new Error(`Error updating profile photo on MongoDB: ${error}`);
    } 

  }

  async getProfile(username: string): Promise<GetProfileReturnType> {
    try {
      const db = await connectDB();
      db.connections[0].on('error', () => {
        console.error.bind(console, 'connection error:')
        throw new Error('Error connecting to MongoDB');
      });

      const userMongoClient = db.connections[0].db?.collection<IUser>('User');

      const userDoc = await userMongoClient?.findOne({ username });

      if (!userDoc) {
        throw new NoItemsFound('username');
      }

      console.log('MONGO REPO USER DOC: ', userDoc);

      const userDto = UserMongoDTO.fromMongo(userDoc, false);
      const user = UserMongoDTO.toEntity(userDto);

      const following: number = user.userFollowing.length;
      let followers = await userMongoClient?.countDocuments({ following: { $elemMatch: { user_followed_id: user.userId } } });
      if (!followers) {
        followers = 0;
      }

      return {
        userId: user.userId as string,
        username: user.userUsername,
        nickname: user.userNickname as string,
        linkTiktok: user.userlinkTiktok,
        backgroundPhoto: user.userBgPhoto,
        profilePhoto: user.userProfilePhoto,
        linkInstagram: user.userlinkInstagram,
        biography: user.userBiography,
        privacy: user.userPrivacy ? user.userPrivacy : PRIVACY_TYPE.PUBLIC,
        following,
        followers
      };

    } catch (error) {
      throw new Error(`Error getting profile on MongoDB: ${error}`);
    }
  }

  async deleteAccount(username: string): Promise<void> {
    try {
      const db = await connectDB();
      db.connections[0].on('error', () => {
        console.error.bind(console, 'connection error:')
        throw new Error('Error connecting to MongoDB');
      });

      const userMongoClient = db.connections[0].db?.collection<IUser>('User');

      await userMongoClient?.deleteOne({ username });

    } catch (error) {
      throw new Error(`Error deleting account on MongoDB: ${error}`);
    }
  }

  async findByUsername(username: string): Promise<User> {
    try {
      const db = await connectDB();
      db.connections[0].on('error', () => {
        console.error.bind(console, 'connection error:')
        throw new Error('Error connecting to MongoDB');
      });

      const userMongoClient = db.connections[0].db?.collection<IUser>('User');

      const userDoc = await userMongoClient?.findOne({ username });

      if (!userDoc) {
        throw new NoItemsFound('username');
      }

      const userDto = UserMongoDTO.fromMongo(userDoc, false);
      const user = UserMongoDTO.toEntity(userDto);

      return user;

    } catch (error: any) {
      throw new Error(`Error finding user by username on MongoDB: ${error.message}`);
    }
  }

  async createReview(
    star: number,
    review: string,
    reviewedAt: Date,
    instituteId: string,
    eventId: string,
    username: string
  ): Promise<void> {
    try {
      const db = await connectDB();
      db.connections[0].on('error', () => {
        console.error.bind(console, 'connection error:')
        throw new Error('Error connecting to MongoDB');
      });

      const userMongoClient = db.connections[0].db?.collection<IUser>('User');

      const userDoc = await userMongoClient?.findOne({ username });

      if (!userDoc) {
        throw new NoItemsFound('username');
      }

      const reviewDoc = {
        star,
        review,
        reviewedAt,
        institute_id: instituteId,
        event_id: eventId
      };

      userDoc.reviews.push(reviewDoc);

      const respMongo = await userMongoClient?.updateOne({ username }, { $set: userDoc });
      console.log('MONGO REPO USER RESPMONGO: ', respMongo);

    } catch (error) {
      throw new Error(`Error creating review on MongoDB: ${error}`);
    }
  }

  async getFriends(username: string): Promise<User[]> {
    try {
      const db = await connectDB();
      db.connections[0].on('error', () => {
        console.error.bind(console, 'connection error:')
        throw new Error('Error connecting to MongoDB');
      });

      const userMongoClient = db.connections[0].db?.collection<IUser>('User');

      const userDoc = await userMongoClient?.findOne({ username });

      if (!userDoc) {
        throw new NoItemsFound('username');
      }

      const friends = userDoc.following.map(friend => {
        return friend.user_followed_id;
      });

      if (!friends) {
        return [];
      }

      const friendsDocs = await userMongoClient?.find({ userId: { $in: friends } }).toArray();

      if (!friendsDocs) {
        throw new NoItemsFound('friends');
      }

      const friendsDto = friendsDocs.map(friendDoc => {
        return UserMongoDTO.fromMongo(friendDoc, false);
      });

      const friendsEntities = friendsDto.map(friendDto => {
        return UserMongoDTO.toEntity(friendDto);
      });

      return friendsEntities;
    } catch (error) {
      throw new Error(`Error getting friends on MongoDB: ${error}`);
    }
  }

  async getAllReviewsByEvent(eventId: string): Promise<User[]> {
    try {
      const db = await connectDB();
      db.connections[0].on('error', () => {
        console.error.bind(console, 'connection error:')
        throw new Error('Error connecting to MongoDB');
      });

      const userMongoClient = db.connections[0].db?.collection<IUser>('User');

      const reviews = await userMongoClient?.find({ 'reviews.event_id': eventId }).toArray();

      if (!reviews) {
        throw new NoItemsFound('reviews');
      }

      const reviewsDto = reviews.map(reviewDoc => {
        return UserMongoDTO.fromMongo(reviewDoc, false);
      });

      const reviewsEntities = reviewsDto.map(reviewDto => {
        return UserMongoDTO.toEntity(reviewDto);
      });

      return reviewsEntities;
    }

    catch (error) {
      throw new Error(`Error getting all reviews by event on MongoDB: ${error}`);
    }
  }

  async findPerson(searchTerm: string): Promise<FindPersonReturnType[]> {
    try {
      const db = await connectDB();
      db.connections[0].on('error', () => {
        console.error.bind(console, 'connection error:')
        throw new Error('Error connecting to MongoDB');
      });

      let persons: IUser[] = [];

      const userMongoClient = db.connections[0].db?.collection<IUser>('User');

      const personsByFirst = await userMongoClient?.find({ $or: [{ username: { $regex: `^${searchTerm}`, $options: 'i' } }, { nickname: { $regex: `^${searchTerm}`, $options: 'i' } }] }).toArray();
      const personsByFull = await userMongoClient?.find({ $or: [{ username: { $regex: `^${searchTerm}`, $options: 'i' } }, { nickname: { $regex: `^${searchTerm}`, $options: 'i' } }] }).toArray();

      if (personsByFirst) {
        persons = persons.concat(personsByFirst);
      }

      if (personsByFull) {
        persons = persons.concat(personsByFull);
      }

      // remove duplicates
      persons = persons.filter((person, index, self) => self.findIndex(p => p.username === person.username) === index);

      const returnType: FindPersonReturnType[] = persons.map(personDoc => {
        const personDto = UserMongoDTO.fromMongo(personDoc, false);
        const person = UserMongoDTO.toEntity(personDto);
        return {
          profilePhoto: person.userProfilePhoto,
          username: person.userUsername,
          nickname: person.userNickname as string
        };
      } 
      );

      return returnType
    } catch (error) {
      throw new Error(`Error finding person on MongoDB: ${error}`);
    } 
  }

  async updateProfile(
    username: string,
    newUsername?: string,
    nickname?: string,
    biography?: string,
    instagramLink?: string,
    tiktokLink?: string
  ) {
    try {
      const db = await connectDB();
      db.connections[0].on('error', () => {
        console.error.bind(console, 'connection error:')
        throw new Error('Error connecting to MongoDB');
      });

      const userMongoClient = db.connections[0].db?.collection<IUser>('User');

      const userDoc = await userMongoClient?.findOne({ username });

      console.log('MONGO REPO USER DOC - UPDATE PROFILE: ', userDoc);

      if (!userDoc) return null

      if (newUsername) {
        userDoc.username = newUsername;
      }

      if (nickname) {
        userDoc.nickname = nickname;
      }

      if (biography) {
        userDoc.biography = biography;
      }

      if (instagramLink) {
        userDoc.lnk_instagram = instagramLink;
      }

      if (tiktokLink) {
        userDoc.lnk_tiktok = tiktokLink;
      }

      const respMongo = await userMongoClient?.updateOne({ username }, { $set: userDoc });
      console.log('MONGO REPO USER RESPMONGO: ', respMongo);

      return true;

    } catch (error) {
      throw new Error(`Error updating profile on MongoDB: ${error}`);
    }
  }

  async favoriteInstitute(username: string, instituteId: string): Promise<void> {
    try{
      const db = await connectDB();
      db.connections[0].on('error', () => {
        console.error.bind(console, 'connection error:')
        throw new Error('Error connecting to MongoDB');
      });

      const userMongoClient = db.connections[0].db?.collection<IUser>('User');

      const userDoc = await userMongoClient?.findOne({ username })

      if (!userDoc) {
        throw new NoItemsFound('username');
      }

      const instituteIdExists = userDoc.favorites.some(favorite => favorite.institute_id === instituteId);

      let updatedFavorites;
      
      if (instituteIdExists) {
        // Remove o instituteId existente
        updatedFavorites = userDoc.favorites.filter(favorite => favorite.institute_id !== instituteId);
      } else {
        // Adiciona o novo instituteId
        updatedFavorites = [...userDoc.favorites, { institute_id: instituteId }];
      }

      await userMongoClient?.updateOne(
        { username }, 
        { $set: { favorites: updatedFavorites } }
      );
    } catch (error: any) {

    }
  }
}
