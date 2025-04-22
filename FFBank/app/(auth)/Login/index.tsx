import { useAuth } from '@/hooks/useAuth';
import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity, KeyboardAvoidingView,
  Platform,
  Alert,
  Image
} from 'react-native';
import * as LocalAuthentication from 'expo-local-authentication';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function LoginScreen() {
  const [apelido, setApelido] = useState('');
  const [senha, setSenha] = useState('');
  const [isSaved, setIsSaved] = useState(false);

  const { handleLogin } = useAuth();

  async function submit() {
  //  if(!isSaved) {
    await AsyncStorage.setItem("@mock-bank-password", senha);
    await AsyncStorage.setItem("@mock-bank-apelido", apelido);
  //  }

    handleLogin(apelido, senha);
  }

  async function handleBiometricAuth() {
    try {
      const isAvailable = await LocalAuthentication.hasHardwareAsync();

      if (!isAvailable) {
        return Alert.alert(
          "Não suportado"
        )
      }

      // Verificar se a biometria esta cadastrada
      const isEnrolled = await LocalAuthentication.isEnrolledAsync();

      if (!isEnrolled) {
        return Alert.alert(
          "Nenhuma biometria"
        )
      }

      // Faz a autenticação
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: "Autentique-se para continuar",
        fallbackLabel: "Usar senha",
        disableDeviceFallback: false
      });

      if (result.success) {
        // Função
      } else {
        // Falha
      }


    } catch (error) {
      console.log(error);
    }
  }

  // Verificação se o dispositivo tem biometria
  useEffect(() => {
    (async () => {
     try {
      const saved = await AsyncStorage.getItem("@allow-fingerprint");
      setIsSaved(saved === "true");

      if(saved === "true") {
        const senha =  await AsyncStorage.getItem("@mock-bank-password");
        const apelido = await AsyncStorage.getItem("@mock-bank-apelido");

        if(senha === null || apelido === null) {
          return;
        }

        const result = await LocalAuthentication.authenticateAsync({
          promptMessage: "Autentique-se para continuar",
          fallbackLabel: "Usar senha",
          disableDeviceFallback: false
        });
  
        if (result.success) {
          handleLogin(apelido, senha);
        } else {
        Alert.alert("Falha na biometria.");
        return;
        }
      }

     } catch (error) {
      console.log(error)
     }
    })();
  }, []);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
        
      <View style={styles.logoContainer}>
        {<Image
          source={require('../../../assets/images/Logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />}
        <Text style={styles.title}>Welcome back</Text>
        <Text style={styles.subTitle}>Sign in to your account</Text>
      </View>

      <View style={styles.formContainer}>
        <Text style={styles.label}>Nickname</Text>
        <TextInput
          style={styles.input}
          placeholder="Felipin"
          value={apelido}
          onChangeText={setApelido}
          autoCapitalize="none"
        />

        <Text style={styles.label}>Password</Text>
        <TextInput
          style={styles.input}
          value={senha}
          onChangeText={setSenha}
          secureTextEntry
        />

        <TouchableOpacity style={styles.loginButton} onPress={submit}>
          <Text style={styles.loginButtonText}>Sign In</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.forgotsenha}>
          <Text style={styles.forgotsenhaText}>Forgot Password?</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },

  logoContainer: {
    marginTop: 30,
    marginBottom: 40,
    marginLeft: 30,
    
  },
  logo: {
    width: 40,
    height: 40,
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 20,
    marginBottom: 5,
  },
  subTitle: {
    fontSize: 16,
    color: '#737373',
  },
  formContainer: {
    paddingHorizontal: 30,
  },
  label: {
    fontSize: 16,
    color: '#737373',
    marginBottom: 5,
    fontWeight: '400',
  },
  input: {
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#FAFAFA',
    fontSize: 16,
  },
  forgotsenha: {
    alignSelf: 'center',
    marginBottom: 20,
  },
  forgotsenhaText: {
    fontWeight: 'bold',
    color: '#4287f5',
    fontSize: 16,
  },
  loginButton: {
    backgroundColor: '#ED145B',
    borderRadius: 8,
    paddingVertical: 15,
    alignItems: 'center',
    marginBottom: 20,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  signupText: {
    color: '#333',
    fontSize: 14,
  },
  signupLink: {
    color: '#4287f5',
    fontSize: 14,
    fontWeight: 'bold',
  },
});