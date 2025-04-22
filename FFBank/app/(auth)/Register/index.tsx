import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  SafeAreaView,
  Image,
} from 'react-native';

export default function Register() {
  const [nome, setNome] = useState('');
  const [cpf, setCpf] = useState('');
  const [apelido, setApelido] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmaSenha, setConfirmaSenha] = useState('');

  const router = useRouter();

  // Função para formatar o CPF enquanto digita
  const formatarCPF = (texto: string) => {
    // Remove todos os caracteres não numéricos
    const numeros = texto.replace(/\D/g, '');

    // Aplica a máscara de CPF (XXX.XXX.XXX-XX)
    let cpfFormatado = numeros;
    if (numeros.length > 3) {
      cpfFormatado = numeros.substring(0, 3) + '.' + numeros.substring(3);
    }
    if (numeros.length > 6) {
      cpfFormatado = cpfFormatado.substring(0, 7) + '.' + numeros.substring(6);
    }
    if (numeros.length > 9) {
      cpfFormatado = cpfFormatado.substring(0, 11) + '-' + numeros.substring(9, 11);
    }

    // Limita a 14 caracteres (XXX.XXX.XXX-XX)
    cpfFormatado = cpfFormatado.substring(0, 14);

    setCpf(cpfFormatado);
  };

  // Validação e envio do formulário
  const handleCadastro = async () => {
   try {
     // Validação básica dos campos
     if (!nome || !cpf || !apelido || !senha || !confirmaSenha) {
      Alert.alert('Erro', 'Todos os campos são obrigatórios');
      return;
    }

    // Validação de CPF (formato básico)
    const cpfRegex = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/;
    if (!cpfRegex.test(cpf)) {
      Alert.alert('Erro', 'CPF inválido. Use o formato: 123.456.789-00');
      return;
    }

    // Validação de senha
    if (senha.length < 6) {
      Alert.alert('Erro', 'A senha deve ter pelo menos 6 caracteres');
      return;
    }

    // Confirmar senha
    if (senha !== confirmaSenha) {
      Alert.alert('Erro', 'As senhas não coincidem');
      return;
    }

    // Criar objeto com os dados do usuário
    const userData = {
      nome,
      cpf,
      apelido,
      senha
    };

    const response = await
      fetch("https://mock-bank-mock-back.yexuz7.easypanel.host/contas", {
        method: "POST",
        headers: {
          'Content-Type': "application/json"
        },
        body: JSON.stringify(userData)
      });
      
    if (!response.ok) {
      const dataError = await response.json();

      throw new Error(dataError?.message);
    }

    Alert.alert(
      'Cadastro realizado',
      `Usuário ${apelido} cadastrado com sucesso!`,
      [
        {
          text: 'OK',
          onPress: () => {
            router.push("/Login")
          }
        }
      ]
    );
   } catch (error) {
    Alert.alert(error?.message)
   }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView contentContainerStyle={styles.scrollView}>
          <View style={styles.header}>
            {<Image
                      source={require('../../../assets/images/Logo.png')}
                      style={styles.logo}
                      resizeMode="contain"
                    />}
            <Text style={styles.title}>Welcome to Rala</Text>
            <Text style={styles.subtitle}>Create a commitment-free profile to explore financial products</Text>
          </View>

            <Text style={styles.label}>Full Name</Text>
            <TextInput
              style={styles.input}
              placeholder="Jonh "
              value={nome}
              onChangeText={setNome}
              autoCapitalize="words"
            />

            <Text style={styles.label}>Document</Text>
            <TextInput
              style={styles.input}
              placeholder="123.456.789-00"
              value={cpf}
              onChangeText={formatarCPF}
              keyboardType="numeric"
              maxLength={14}
            />

            <Text style={styles.label}>nickname</Text>
            <TextInput
              style={styles.input}
              placeholder="jonh"
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

            <TouchableOpacity style={styles.button} onPress={handleCadastro}>
              <Text style={styles.buttonText}>CADASTRAR</Text>
            </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  logo: {
    width: 40,
    height: 40,
    marginBottom: 20,
  },
  keyboardView: {
    flex: 1,
  },
  scrollView: {
    flexGrow: 1,
    padding: 20,
  },
  header: {
    marginTop: 20,
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2e3e5c',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#737373',
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
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#FAFAFA',
    fontSize: 16,
  },
  button: {
    backgroundColor: '#ED145B',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
    shadowColor: '#ED145B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
