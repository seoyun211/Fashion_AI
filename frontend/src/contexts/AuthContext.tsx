// src/contexts/AuthContext.tsx
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../firebase/firebaseConfig';

// 사용자 프로필 타입 정의
export interface UserProfile {
  uid: string;
  email: string;
  gender: 'male' | 'female' | 'other';
  height: number;
  weight: number;
  preferredColors: string[];
  preferredStyles: string[];
  createdAt: Date;
  updatedAt?: Date;
}

// 인증 컨텍스트 타입 정의
interface AuthContextType {
  currentUser: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, profileData: Omit<UserProfile, 'uid' | 'email' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const useAuth = () => {
  return useContext(AuthContext);
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // 회원가입
  const signup = async (email: string, password: string, profileData: Omit<UserProfile, 'uid' | 'email' | 'createdAt' | 'updatedAt'>) => {
    try {
      console.log('🚀 회원가입 시작:', { email, profileData });
      
      // Firebase Auth로 사용자 생성
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      console.log('✅ Firebase Auth 사용자 생성 성공:', user.uid);

      // Firestore에 저장할 사용자 프로필 데이터 준비
      const profile = {
        uid: user.uid,
        email: user.email!,
        ...profileData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };

      console.log('💾 Firestore에 저장할 데이터:', profile);

      // Firestore에 사용자 프로필 저장
      const userDocRef = doc(db, 'users', user.uid);
      await setDoc(userDocRef, profile);
      console.log('✅ Firestore에 사용자 프로필 저장 완료');

      // 저장된 데이터 확인을 위해 다시 읽어오기
      const savedDoc = await getDoc(userDocRef);
      if (savedDoc.exists()) {
        const savedData = savedDoc.data();
        console.log('📋 저장된 데이터 확인:', savedData);

        // 로컬 상태 업데이트
        const profileWithDates: UserProfile = {
          ...savedData,
          createdAt: savedData.createdAt?.toDate() || new Date(),
          updatedAt: savedData.updatedAt?.toDate() || new Date()
        } as UserProfile;

        setUserProfile(profileWithDates);
        console.log('✅ 로컬 상태 업데이트 완료:', profileWithDates);
      }

    } catch (error: any) {
      console.error('❌ 회원가입 오류:', error);
      throw error;
    }
  };

  // 로그인
  const login = async (email: string, password: string) => {
    try {
      console.log('🔐 로그인 시작:', email);
      
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      console.log('✅ Firebase Auth 로그인 성공:', user.uid);

      // Firestore에서 사용자 프로필 불러오기
      await loadUserProfile(user.uid);
      
    } catch (error: any) {
      console.error('❌ 로그인 오류:', error);
      throw error;
    }
  };

  // 로그아웃
  const logout = async () => {
    try {
      await signOut(auth);
      setUserProfile(null);
      console.log('✅ 로그아웃 완료');
    } catch (error: any) {
      console.error('❌ 로그아웃 오류:', error);
      throw error;
    }
  };

  // 사용자 프로필 로드
  const loadUserProfile = async (uid: string) => {
    try {
      const userDocRef = doc(db, 'users', uid);
      const userDoc = await getDoc(userDocRef);
      
      if (userDoc.exists()) {
        const userData = userDoc.data();
        const profile: UserProfile = {
          ...userData,
          createdAt: userData.createdAt?.toDate() || new Date(),
          updatedAt: userData.updatedAt?.toDate() || new Date()
        } as UserProfile;
        
        setUserProfile(profile);
        console.log('✅ 사용자 프로필 로드 완료:', profile);
      } else {
        console.log('❌ 사용자 프로필이 존재하지 않습니다');
        setUserProfile(null);
      }
    } catch (error: any) {
      console.error('❌ 사용자 프로필 로드 오류:', error);
      setUserProfile(null);
    }
  };

  // 인증 상태 변경 감지
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      console.log('🔍 인증 상태 변경:', user?.uid || 'null');
      
      setCurrentUser(user);
      
      if (user) {
        await loadUserProfile(user.uid);
      } else {
        setUserProfile(null);
      }
      
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value: AuthContextType = {
    currentUser,
    userProfile,
    loading,
    login,
    signup,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};