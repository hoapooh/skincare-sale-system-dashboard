import { toaster } from '@/components/ui/toaster';
import { Field } from '@/components/ui/field';
import { InputGroup } from '@/components/ui/input-group';
import {
  createProductApi,
  getProductByIdApi,
  updateProductApi,
} from '@/services/productApi';
import {
  Button,
  Center,
  CloseButton,
  HStack,
  Input,
  NumberInput,
  Portal,
  Select,
  Spinner,
  Textarea,
  VStack,
  Checkbox,
  CheckboxGroup,
  Stack,
} from '@chakra-ui/react';
import {
  DialogRoot,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogBody,
  DialogFooter,
  DialogBackdrop,
  DialogCloseTrigger,
} from '@/components/ui/dialog';
import { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

// Form validation schema
const productSchema = z.object({
  name: z.string().min(3, 'Product name must be at least 3 characters'),
  description: z.string().optional(),
  price: z.number().positive('Price must be positive'),
  stock: z
    .number()
    .int('Stock must be an integer')
    .nonnegative('Stock must be positive'),
  imageUrl: z.string().url('Must be a valid URL').optional(),
  brand: z.string().min(2, 'Brand is required'),
  category: z.string().min(2, 'Category is required'),
  suitableFor: z.array(z.string()).min(1, 'Select at least one skin type'),
  gender: z.string().min(2, 'Gender is required'),
  volume: z.string().min(1, 'Volume is required'),
});

// Product categories
const categories = [
  'Cleansers',
  'Toners',
  'Serums',
  'Moisturizers',
  'Sunscreens',
  'Masks',
  'Exfoliators',
  'Eye Creams',
  'Lip Care',
  'Body Care',
  'Other',
];

// Skin types
const skinTypes = [
  { value: 'normal', label: 'Normal' },
  { value: 'dry', label: 'Dry' },
  { value: 'oily', label: 'Oily' },
  { value: 'combination', label: 'Combination' },
  { value: 'sensitive', label: 'Sensitive' },
];

// Brands
const brands = [
  'LuxeSkin',
  'NatureBelle',
  'PureDerm',
  'GlowUp',
  'EssentialSkin',
  'Other',
];

// Genders
const genders = ['Male', 'Female', 'Unisex'];

const ProductFormModal = ({
  open,
  setOpen,
  productId,
  isEditing,
  onSuccess,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    control,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: '',
      description: '',
      price: 0,
      stock: 0,
      imageUrl: '',
      brand: '',
      category: '',
      suitableFor: [],
      gender: 'Unisex',
      volume: '',
    },
  });

  // Fetch product data when editing
  useEffect(() => {
    const fetchProduct = async () => {
      if (!isEditing || !productId) return;

      setIsFetching(true);
      try {
        const product = await getProductByIdApi(productId);
        if (product) {
          setValue('name', product.name);
          setValue('description', product.description || '');
          setValue('price', product.price);
          setValue('stock', product.stock);
          setValue('imageUrl', product.imageUrl || '');
          setValue('brand', product.brand);
          setValue('category', product.category || '');
          setValue('suitableFor', product.suitableFor || []);
          setValue('gender', product.gender);
          setValue('volume', product.volume);
        }
      } catch (error) {
        console.error('Error fetching product details:', error);
        toaster.create({
          title: 'Error',
          description: 'Failed to load product details',
          type: 'error',
        });
        setOpen(false);
      } finally {
        setIsFetching(false);
      }
    };

    if (open) {
      if (isEditing) {
        fetchProduct();
      } else {
        // Reset form when creating a new product
        reset({
          name: '',
          description: '',
          price: 0,
          stock: 0,
          imageUrl: '',
          brand: '',
          category: '',
          suitableFor: [],
          gender: 'Unisex',
          volume: '',
        });
      }
    }
  }, [open, isEditing, productId, reset, setValue, setOpen]);

  const onSubmit = async data => {
    setIsLoading(true);
    try {
      if (isEditing) {
        await updateProductApi(productId, data);
        toaster.create({
          title: 'Success',
          description: 'Product updated successfully',
          type: 'success',
        });
      } else {
        await createProductApi(data);
        toaster.create({
          title: 'Success',
          description: 'Product created successfully',
          type: 'success',
        });
      }

      if (onSuccess) {
        onSuccess();
      }
      setOpen(false);
    } catch (error) {
      console.error('Error saving product:', error);
      toaster.create({
        title: 'Error',
        description: isEditing
          ? 'Failed to update product'
          : 'Failed to create product',
        type: 'error',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <DialogRoot open={open} onOpenChange={e => setOpen(e.open)}>
      <Portal>
        <DialogBackdrop />
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {isEditing ? 'Edit Product' : 'Create New Product'}
            </DialogTitle>
            <DialogCloseTrigger asChild>
              <CloseButton position="absolute" right={4} top={4} />
            </DialogCloseTrigger>
          </DialogHeader>

          <DialogBody>
            {isFetching ? (
              <Center h="200px">
                <Spinner
                  thickness="4px"
                  speed="0.65s"
                  emptyColor="gray.200"
                  color="brown"
                  size="xl"
                />
              </Center>
            ) : (
              <VStack spacing={4} align="stretch">
                <Field
                  label="Product Name"
                  invalid={!!errors.name}
                  errorText={errors?.name?.message}
                  required
                >
                  <Input
                    placeholder="Enter product name"
                    {...register('name')}
                  />
                </Field>

                <HStack spacing={4}>
                  <Field
                    label="Price (VND)"
                    invalid={!!errors.price}
                    errorText={errors?.price?.message}
                    required
                    flex={1}
                  >
                    <NumberInput min={0} precision={0}>
                      <NumberInput.Input
                        placeholder="Enter price"
                        {...register('price', { valueAsNumber: true })}
                      />
                      <NumberInput.Control>
                        <NumberInput.IncrementTrigger />
                        <NumberInput.DecrementTrigger />
                      </NumberInput.Control>
                    </NumberInput>
                  </Field>

                  <Field
                    label="Stock"
                    invalid={!!errors.stock}
                    errorText={errors?.stock?.message}
                    required
                    flex={1}
                  >
                    <NumberInput min={0} precision={0}>
                      <NumberInput.Input
                        placeholder="Enter stock quantity"
                        {...register('stock', { valueAsNumber: true })}
                      />
                      <NumberInput.Control>
                        <NumberInput.IncrementTrigger />
                        <NumberInput.DecrementTrigger />
                      </NumberInput.Control>
                    </NumberInput>
                  </Field>
                </HStack>

                <HStack spacing={4}>
                  <Field
                    label="Brand"
                    invalid={!!errors.brand}
                    errorText={errors?.brand?.message}
                    required
                    flex={1}
                  >
                    <Select placeholder="Select brand" {...register('brand')}>
                      {brands.map(brand => (
                        <option key={brand} value={brand}>
                          {brand}
                        </option>
                      ))}
                    </Select>
                  </Field>

                  <Field
                    label="Category"
                    invalid={!!errors.category}
                    errorText={errors?.category?.message}
                    required
                    flex={1}
                  >
                    <Select
                      placeholder="Select category"
                      {...register('category')}
                    >
                      {categories.map(category => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </Select>
                  </Field>
                </HStack>

                <HStack spacing={4}>
                  <Field
                    label="Gender"
                    invalid={!!errors.gender}
                    errorText={errors?.gender?.message}
                    required
                    flex={1}
                  >
                    <Select placeholder="Select gender" {...register('gender')}>
                      {genders.map(gender => (
                        <option key={gender} value={gender}>
                          {gender}
                        </option>
                      ))}
                    </Select>
                  </Field>

                  <Field
                    label="Volume"
                    invalid={!!errors.volume}
                    errorText={errors?.volume?.message}
                    required
                    flex={1}
                  >
                    <Input
                      placeholder="e.g., 50ml, 100g"
                      {...register('volume')}
                    />
                  </Field>
                </HStack>

                <Field
                  label="Suitable For"
                  invalid={!!errors.suitableFor}
                  errorText={errors?.suitableFor?.message}
                  required
                >
                  <Controller
                    control={control}
                    name="suitableFor"
                    render={({ field }) => (
                      <CheckboxGroup
                        value={field.value}
                        onChange={field.onChange}
                      >
                        <Stack spacing={2} direction="row" flexWrap="wrap">
                          {skinTypes.map(type => (
                            <Checkbox key={type.value} value={type.value}>
                              {type.label}
                            </Checkbox>
                          ))}
                        </Stack>
                      </CheckboxGroup>
                    )}
                  />
                </Field>

                <Field
                  label="Image URL"
                  invalid={!!errors.imageUrl}
                  errorText={errors?.imageUrl?.message}
                >
                  <InputGroup>
                    <Input
                      placeholder="Enter image URL"
                      {...register('imageUrl')}
                    />
                  </InputGroup>
                </Field>

                <Field
                  label="Description"
                  invalid={!!errors.description}
                  errorText={errors?.description?.message}
                >
                  <Textarea
                    placeholder="Enter product description"
                    rows={4}
                    resize="vertical"
                    {...register('description')}
                  />
                </Field>
              </VStack>
            )}
          </DialogBody>

          <DialogFooter>
            <HStack spacing={2}>
              <DialogCloseTrigger asChild>
                <Button variant="outline">Cancel</Button>
              </DialogCloseTrigger>
              <Button
                colorPalette="black"
                isLoading={isLoading}
                onClick={handleSubmit(onSubmit)}
                disabled={isFetching}
              >
                {isEditing ? 'Update Product' : 'Create Product'}
              </Button>
            </HStack>
          </DialogFooter>
        </DialogContent>
      </Portal>
    </DialogRoot>
  );
};

export default ProductFormModal;
