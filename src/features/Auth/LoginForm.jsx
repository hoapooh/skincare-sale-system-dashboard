import { Flex, Box, Input, Stack, Button, Heading } from '@chakra-ui/react';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { LuEye, LuEyeOff, LuMail } from 'react-icons/lu';
import { InputGroup } from '@/components/ui/input-group';
import { loginApi } from '@/services/authApi';
import { toaster } from '@/components/ui/toaster';
import { useAuthStore } from '@/store/authStore';
import { useNavigate } from 'react-router-dom';
import { Field } from '@/components/ui/field';

const formSchema = z.object({
  email: z.string().nonempty('Vui lòng nhập email').email('Email không hợp lệ'),
  password: z.string().nonempty('Vui lòng nhập mật khẩu').min(3, {
    message: 'Mật khẩu phải dài ít nhất 3 ký tự',
  }),
});

const LoginForm = () => {
  const navigate = useNavigate();
  const [isSubmit, setIsSubmit] = useState(false);
  const [visivility, setVisivility] = useState(false);
  const { login } = useAuthStore();

  const toggleVisivility = () => {
    setVisivility(!visivility);
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async credentials => {
    setIsSubmit(true);
    try {
      const loginResponse = await loginApi(
        credentials.email,
        credentials.password
      );

      if (loginResponse) {
        login(loginResponse);
        toaster.create({
          title: 'Login successful',
          type: 'success',
        });

        navigate('/');
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || 'Đăng nhập không thành công';
      toaster.create({ title: errorMessage, type: 'error' });
    } finally {
      setIsSubmit(false);
    }
  };

  return (
    <Flex
      minH={'100vh'}
      align={'center'}
      justify={'center'}
      style={{
        background: 'linear-gradient(45deg, #c5a25d 0%, #764ba2 100%)',
      }}
    >
      <Stack gap={8} mx={'auto'} minW={'lg'} py={12} px={6}>
        <Stack align={'center'}>
          <Heading fontSize={'4xl'}>Sign in</Heading>
        </Stack>

        <Box rounded={'lg'} bg={'whiteAlpha.500'} boxShadow={'lg'} p={8}>
          <Stack gap={4}>
            <Field
              invalid={errors.email}
              errorText={errors?.email?.message}
              width="full"
            >
              <InputGroup
                flex="1"
                width="full"
                endElement={<LuMail size={20} stroke="#2c2c2d" />}
              >
                <Input
                  placeholder="Enter your email"
                  bg="white"
                  {...register('email')}
                />
              </InputGroup>
            </Field>

            <Field
              invalid={errors.password}
              errorText={errors?.password?.message}
            >
              <InputGroup
                flex="1"
                width="full"
                endElement={
                  visivility ? (
                    <LuEyeOff
                      size={22}
                      stroke="#2c2c2d"
                      style={{ cursor: 'pointer' }}
                      onClick={toggleVisivility}
                    />
                  ) : (
                    <LuEye
                      size={22}
                      stroke="#2c2c2d"
                      style={{ cursor: 'pointer' }}
                      onClick={toggleVisivility}
                    />
                  )
                }
              >
                <Input
                  width={'full'}
                  type={visivility ? 'text' : 'password'}
                  placeholder="Enter your password"
                  bg="white"
                  {...register('password')}
                />
              </InputGroup>
            </Field>

            <Button
              bg={'black'}
              color={'white'}
              _hover={{
                bg: 'blackAlpha.800',
              }}
              onClick={handleSubmit(onSubmit)}
              loading={isSubmit}
            >
              Sign in
            </Button>
          </Stack>
        </Box>
      </Stack>
    </Flex>
  );
};
export default LoginForm;
