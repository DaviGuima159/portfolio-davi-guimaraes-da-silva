import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { QRState, INITIAL_QR_STATE, QRHistoryItem, QRUser, QRTemplate } from '../types/qr';
import { Options } from 'qr-code-styling';
import { auth, db, loginWithGoogle, logout as firebaseLogout } from '../services/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { collection, query, onSnapshot, orderBy, doc, setDoc, deleteDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { handleFirestoreError } from '../utils/errorHandlers';

interface QRContextType {
  state: QRState;
  user: QRUser | null;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  updateData: (data: string) => void;
  updateOptions: (options: Partial<Options>) => void;
  updateExtension: (ext: QRState['extension']) => void;
  updateDownloadSize: (size: number) => void;
  applyPreset: (presetOptions: Partial<Options>) => void;
  saveAsTemplate: (name: string) => Promise<void>;
  deleteTemplate: (id: string) => Promise<void>;
  fetchLogoFromUrl: (url: string) => Promise<void>;
  autoCorrectContrast: () => void;
  saveToHistory: () => void;
  toggleFavorite: (id: string) => void;
  deleteHistoryItem: (id: string) => void;
  loadHistoryItem: (item: QRHistoryItem) => void;
  download: () => void;
  setDownloadTrigger: (fn: (options?: { extension?: QRState['extension'], size?: number }) => void) => void;
  resetStyling: () => void;
  reset: () => void;
}

const QRContext = createContext<QRContextType | undefined>(undefined);

export function QRProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<QRState>(INITIAL_QR_STATE);
  const [downloadFn, setDownloadFn] = useState<((options?: { extension?: QRState['extension'], size?: number }) => void) | null>(null);

  // Authentication Listener
  useEffect(() => {
    return onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const qrUser: QRUser = {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName,
          photoURL: firebaseUser.photoURL,
        };
        setState(prev => ({ ...prev, user: qrUser }));

        // Sync local user profile to Firestore
        try {
          await setDoc(doc(db, 'users', firebaseUser.uid), {
            ...qrUser,
            updatedAt: serverTimestamp()
          }, { merge: true });
        } catch (e) {
          console.error("Failed to sync user profile", e);
        }
      } else {
        setState(prev => ({ ...prev, user: null, history: [], customTemplates: [] }));
      }
    });
  }, []);

  // Sync Listeners
  useEffect(() => {
    if (!state.user) {
      // Load initial data from localStorage for guests
      const savedHistory = typeof window !== 'undefined' ? localStorage.getItem('qr-forge-history') : null;
      const savedTemplates = typeof window !== 'undefined' ? localStorage.getItem('qr-forge-templates') : null;
      
      setState(prev => ({ 
        ...prev, 
        history: savedHistory ? JSON.parse(savedHistory) : [],
        customTemplates: savedTemplates ? JSON.parse(savedTemplates) : []
      }));
      return;
    }

    // History Listener
    const hQ = query(
      collection(db, 'users', state.user.uid, 'history'),
      orderBy('timestamp', 'desc')
    );
    const unsubHistory = onSnapshot(hQ, (snapshot) => {
      const history = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id })) as QRHistoryItem[];
      setState(prev => ({ ...prev, history }));
    });

    // Templates Listener
    const tQ = query(
      collection(db, 'users', state.user.uid, 'templates'),
      orderBy('timestamp', 'desc')
    );
    const unsubTemplates = onSnapshot(tQ, (snapshot) => {
      const customTemplates = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id })) as QRTemplate[];
      setState(prev => ({ ...prev, customTemplates }));
    });

    return () => {
      unsubHistory();
      unsubTemplates();
    };
  }, [state.user]);

  // Sync guest data to localStorage
  useEffect(() => {
    if (!state.user) {
      localStorage.setItem('qr-forge-history', JSON.stringify(state.history));
      localStorage.setItem('qr-forge-templates', JSON.stringify(state.customTemplates));
    }
  }, [state.user, state.history, state.customTemplates]);

  const login = async () => {
    await loginWithGoogle();
  };

  const logout = async () => {
    await firebaseLogout();
  };

  const updateData = useCallback((data: string) => {
    setState((prev) => ({
      ...prev,
      data,
      options: { ...prev.options, data }
    }));
  }, []);

  const updateOptions = useCallback((newOptions: Partial<Options>) => {
    setState((prev) => ({
      ...prev,
      options: { 
        ...prev.options, 
        ...newOptions,
        dotsOptions: { ...prev.options.dotsOptions, ...newOptions.dotsOptions },
        backgroundOptions: { ...prev.options.backgroundOptions, ...newOptions.backgroundOptions },
        imageOptions: { ...prev.options.imageOptions, ...newOptions.imageOptions },
        cornersSquareOptions: { ...prev.options.cornersSquareOptions, ...newOptions.cornersSquareOptions },
        cornersDotOptions: { ...prev.options.cornersDotOptions, ...newOptions.cornersDotOptions }
      }
    }));
  }, []);

  const updateExtension = useCallback((extension: QRState['extension']) => {
    setState((prev) => ({ ...prev, extension }));
  }, []);

  const updateDownloadSize = useCallback((downloadSize: number) => {
    setState((prev) => ({ ...prev, downloadSize }));
  }, []);

  const applyPreset = useCallback((presetOptions: Partial<Options>) => {
    setState((prev) => ({
      ...prev,
      options: { 
        ...prev.options, 
        ...presetOptions,
        dotsOptions: { ...prev.options.dotsOptions, ...presetOptions.dotsOptions },
        backgroundOptions: { ...prev.options.backgroundOptions, ...presetOptions.backgroundOptions },
        cornersSquareOptions: { ...prev.options.cornersSquareOptions, ...presetOptions.cornersSquareOptions },
        cornersDotOptions: { ...prev.options.cornersDotOptions, ...presetOptions.cornersDotOptions }
      }
    }));
  }, []);

  const fetchLogoFromUrl = useCallback(async (url: string) => {
    try {
      const hostname = new URL(url).hostname;
      const logoUrl = `https://www.google.com/s2/favicons?domain=${hostname}&sz=128`;
      
      // Convert to data URL to avoid CORS issues in the canvas
      const response = await fetch(logoUrl);
      const blob = await response.blob();
      const reader = new FileReader();
      reader.onloadend = () => {
        applyPreset({ image: reader.result as string });
      };
      reader.readAsDataURL(blob);
    } catch (e) {
      console.error('Failed to auto-fetch logo', e);
    }
  }, [applyPreset]);

  const autoCorrectContrast = useCallback(() => {
    setState((prev) => {
      const bg = prev.options.backgroundOptions?.color || '#FFFFFF';
      // Simple luminance check
      const r = parseInt(bg.slice(1, 3), 16);
      const g = parseInt(bg.slice(3, 5), 16);
      const b = parseInt(bg.slice(5, 7), 16);
      const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
      
      const newPrimary = luminance > 0.5 ? '#000000' : '#FFFFFF';
      
      return {
        ...prev,
        options: {
          ...prev.options,
          dotsOptions: { ...prev.options.dotsOptions, color: newPrimary },
          cornersSquareOptions: { ...prev.options.cornersSquareOptions, color: newPrimary },
          cornersDotOptions: { ...prev.options.cornersDotOptions, color: newPrimary },
        }
      };
    });
  }, []);

  const saveToHistory = useCallback(async () => {
    const newItem: QRHistoryItem = {
      id: Math.random().toString(36).substr(2, 9),
      timestamp: Date.now(),
      data: state.data,
      options: { ...state.options },
      isFavorite: false
    };

    if (state.user) {
      try {
        await setDoc(doc(db, 'users', state.user.uid, 'history', newItem.id), {
          ...newItem,
          authorId: state.user.uid
        });
      } catch (e) {
        handleFirestoreError(e, 'create', `users/${state.user.uid}/history/${newItem.id}`);
      }
    } else {
      setState((prev) => ({
        ...prev,
        history: [newItem, ...prev.history].slice(0, 50)
      }));
    }
  }, [state.data, state.options, state.user]);

  const toggleFavorite = useCallback(async (id: string) => {
    if (state.user) {
      const item = state.history.find(h => h.id === id);
      if (item) {
        try {
          await updateDoc(doc(db, 'users', state.user.uid, 'history', id), {
            isFavorite: !item.isFavorite
          });
        } catch (e) {
          handleFirestoreError(e, 'update', `users/${state.user.uid}/history/${id}`);
        }
      }
    } else {
      setState((prev) => ({
        ...prev,
        history: prev.history.map(item => 
          item.id === id ? { ...item, isFavorite: !item.isFavorite } : item
        )
      }));
    }
  }, [state.user, state.history]);

  const deleteHistoryItem = useCallback(async (id: string) => {
    if (state.user) {
      try {
        await deleteDoc(doc(db, 'users', state.user.uid, 'history', id));
      } catch (e) {
        handleFirestoreError(e, 'delete', `users/${state.user.uid}/history/${id}`);
      }
    } else {
      setState((prev) => ({
        ...prev,
        history: prev.history.filter(item => item.id !== id)
      }));
    }
  }, [state.user]);

  const loadHistoryItem = useCallback((item: QRHistoryItem) => {
    setState((prev) => ({
      ...prev,
      data: item.data,
      options: { ...item.options }
    }));
  }, []);

  const download = useCallback(() => {
    if (downloadFn) {
      downloadFn({ extension: state.extension, size: state.downloadSize });
      saveToHistory();
    }
  }, [downloadFn, state.extension, state.downloadSize, saveToHistory]);

  const setDownloadTrigger = useCallback((fn: (options?: { extension?: QRState['extension'], size?: number }) => void) => {
    setDownloadFn(() => fn);
  }, []);

  const resetStyling = useCallback(() => {
    setState((prev) => ({
      ...prev,
      options: { ...INITIAL_QR_STATE.options, data: prev.data }
    }));
  }, []);

  const reset = useCallback(() => {
    setState((prev) => ({
      ...INITIAL_QR_STATE,
      history: prev.history,
      customTemplates: prev.customTemplates,
      user: prev.user
    }));
  }, []);

  const saveAsTemplate = useCallback(async (name: string) => {
    const newTemplate: QRTemplate = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      options: { ...state.options },
      timestamp: Date.now()
    };

    if (state.user) {
      try {
        await setDoc(doc(db, 'users', state.user.uid, 'templates', newTemplate.id), {
          ...newTemplate,
          authorId: state.user.uid
        });
      } catch (e) {
        handleFirestoreError(e, 'create', `users/${state.user.uid}/templates/${newTemplate.id}`);
      }
    } else {
      setState(prev => ({
        ...prev,
        customTemplates: [newTemplate, ...prev.customTemplates]
      }));
    }
  }, [state.options, state.user]);

  const deleteTemplate = useCallback(async (id: string) => {
    if (state.user) {
      try {
        await deleteDoc(doc(db, 'users', state.user.uid, 'templates', id));
      } catch (e) {
        handleFirestoreError(e, 'delete', `users/${state.user.uid}/templates/${id}`);
      }
    } else {
      setState(prev => ({
        ...prev,
        customTemplates: prev.customTemplates.filter(t => t.id !== id)
      }));
    }
  }, [state.user]);

  return (
    <QRContext.Provider value={{ 
      state, 
      user: state.user,
      login,
      logout,
      updateData, 
      updateOptions, 
      updateExtension, 
      updateDownloadSize,
      applyPreset,
      saveAsTemplate,
      deleteTemplate,
      fetchLogoFromUrl,
      autoCorrectContrast,
      saveToHistory,
      toggleFavorite,
      deleteHistoryItem,
      loadHistoryItem,
      download, 
      setDownloadTrigger, 
      resetStyling,
      reset 
    }}>
      {children}
    </QRContext.Provider>
  );
}

export function useQR() {
  const context = useContext(QRContext);
  if (!context) {
    throw new Error('useQR deve ser usado dentro de um QRProvider');
  }
  return context;
}
