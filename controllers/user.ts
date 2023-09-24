  import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { In } from "typeorm";
import { NUser } from "../@types/user.js";
import { User } from "../db/entities/User.js";


  import sataSource from "../db/dbconfig.js";
import { Permission } from "../db/entities/Permission.js";
import { Role } from "../db/entities/Role.js";


  const createUser = (payload: NUser.Item) => {
    return sataSource.manager.transaction(async transaction => {
        //const role = await Role.findOneBy({ name: payload.fullName })
        const newUser = User.create({
            ...payload,
            recover: [] as Role[]
        });
        await transaction.save(newUser);
    });
  }

  const createPermission = async (payload: Permission) => {
    try {
        const permission = Permission.create(payload)
        await permission.save()
    } catch (error) {
        throw ("Something went wrong")
    }
  }


  const createRole = async (payload: Role) => {
    try {
        const role = new Role()
        role.name = payload.name
        role.permissions = await Permission.findBy({
            id: In(payload.permissions)
        })

        await role.save()
    } catch (error) {
      console.log(error);
        throw ("Something went wrong")
    }
  }


  const login = async (email: string, password: string) => {
    try {
        const user = await User.findOneBy({
            email
        });

        const passwordMatching = await bcrypt.compare(password, user?.password || '')

        if (user && passwordMatching) {
            const token = jwt.sign({
                email: user.email,
                userName: user.userName
            }, process.env.SECRET_KEY || "", {
                expiresIn: "30m"
            })

            return {
                user,
                token
            }
        } else {
            throw ("invalid email or password")
        }
    } catch (error) {
        throw ("invalid email or password")
    }
  }

  const getAllUsers = () => {
    const users = User.find()
    return users
  }

  const getAllRoles = () => {
    const roles = Role.find()
    return roles
  }

  const getAllPermission = () => {
    const permission = Permission.find()
    return permission
  }

  export { createPermission, createRole, createUser, getAllPermission, getAllRoles, getAllUsers, login };

