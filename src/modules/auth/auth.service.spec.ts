import { Test } from '@nestjs/testing';
import { ConflictException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { AuthService } from './auth.service.js';
import { UserRepository } from './repositories/user.repository.js';
import { User } from './domain/user.entity.js';

describe('AuthService', () => {
  let service: AuthService;

  const mockUserRepository = {
    findByUsername: vi.fn(),
    findById: vi.fn(),
    create: vi.fn(),
  };

  const mockJwtService = {
    signAsync: vi.fn(),
  };

  const baseUser: User = {
    id: 'user-1',
    username: 'budi',
    email: 'budi@example.com',
    password: 'irrelevant-placeholder-hash',
    fullName: 'Budi Santoso',
    role: 'user',
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UserRepository, useValue: mockUserRepository },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    service = moduleRef.get(AuthService);
    vi.clearAllMocks();
  });

  describe('register', () => {
    it('creates a new user when username is not taken', async () => {
      mockUserRepository.findByUsername.mockResolvedValue(null);
      mockUserRepository.create.mockResolvedValue(baseUser);

      const result = await service.register({
        username: 'budi',
        email: 'budi@example.com',
        password: 'plainpassword123',
      });

      expect(result).not.toHaveProperty('password');
      expect(mockUserRepository.create).toHaveBeenCalledTimes(1);
    });

    it('hashes the password before saving, does not store it in plain text', async () => {
      mockUserRepository.findByUsername.mockResolvedValue(null);
      mockUserRepository.create.mockResolvedValue(baseUser);

      await service.register({
        username: 'budi',
        email: 'budi@example.com',
        password: 'plainpassword123',
      });

      const savedData = mockUserRepository.create.mock.calls[0][0];
      expect(savedData.password).not.toBe('plainpassword123');
    });

    it('throws ConflictException when username is already taken', async () => {
      mockUserRepository.findByUsername.mockResolvedValue(baseUser);

      await expect(
        service.register({
          username: 'budi',
          email: 'budi@example.com',
          password: 'plainpassword123',
        }),
      ).rejects.toThrow(ConflictException);
      expect(mockUserRepository.create).not.toHaveBeenCalled();
    });
  });

  describe('login', () => {
    it('returns an access token and safe user data on valid credentials', async () => {
      const hashed = await bcrypt.hash('correct-password', 10);
      mockUserRepository.findByUsername.mockResolvedValue({ ...baseUser, password: hashed });
      mockJwtService.signAsync.mockResolvedValue('signed.jwt.token');

      const result = await service.login({ username: 'budi', password: 'correct-password' });

      expect(result.accessToken).toBe('signed.jwt.token');
      expect(result.user).not.toHaveProperty('password');
    });

    it('signs the JWT with the correct payload', async () => {
      const hashed = await bcrypt.hash('correct-password', 10);
      mockUserRepository.findByUsername.mockResolvedValue({ ...baseUser, password: hashed });
      mockJwtService.signAsync.mockResolvedValue('signed.jwt.token');

      await service.login({ username: 'budi', password: 'correct-password' });

      expect(mockJwtService.signAsync).toHaveBeenCalledWith({
        sub: baseUser.id,
        username: baseUser.username,
        role: baseUser.role,
      });
    });

    it('throws UnauthorizedException when username does not exist', async () => {
      mockUserRepository.findByUsername.mockResolvedValue(null);

      await expect(
        service.login({ username: 'unknown', password: 'whatever123' }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('throws UnauthorizedException when password is wrong', async () => {
      const hashed = await bcrypt.hash('correct-password', 10);
      mockUserRepository.findByUsername.mockResolvedValue({ ...baseUser, password: hashed });

      await expect(
        service.login({ username: 'budi', password: 'wrong-password' }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('gives the same error message for an unknown username and a wrong password', async () => {
      mockUserRepository.findByUsername.mockResolvedValueOnce(null);
      const unknownUsernameError: Error = await service
        .login({ username: 'unknown', password: 'whatever123' })
        .catch((error: Error) => error);

      const hashed = await bcrypt.hash('correct-password', 10);
      mockUserRepository.findByUsername.mockResolvedValueOnce({ ...baseUser, password: hashed });
      const wrongPasswordError: Error = await service
        .login({ username: 'budi', password: 'wrong-password' })
        .catch((error: Error) => error);

      expect(unknownUsernameError.message).toBe(wrongPasswordError.message);
    });
  });

  describe('getProfile', () => {
    it('returns safe user data when the user exists', async () => {
      mockUserRepository.findById.mockResolvedValue(baseUser);

      const result = await service.getProfile(baseUser.id);

      expect(result).not.toHaveProperty('password');
      expect(result.id).toBe(baseUser.id);
    });

    it('throws UnauthorizedException when the user does not exist', async () => {
      mockUserRepository.findById.mockResolvedValue(null);

      await expect(service.getProfile('nonexistent-id')).rejects.toThrow(UnauthorizedException);
    });
  });
});
