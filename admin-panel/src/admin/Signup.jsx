import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Page,
  Card,
  FormLayout,
  TextField,
  Button,
  TextContainer,
} from '@shopify/polaris';

export default function Signup() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
  });

  const handleChange = (field) => (value) => {
    setForm({ ...form, [field]: value });
  };

  const handleSignup = async () => {
    try {
      // Send to backend signup API
      const response = await fetch('http://localhost:5000/admin/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await response.json();
      if (response.ok) {
        localStorage.setItem('admin-token', data.token); // store token
        navigate('/admin/dashboard');
      } else {
        alert(data.error || 'Signup failed');
      }
    } catch (err) {
      alert('Error during signup');
      console.error(err);
    }
  };

  return (
    <Page title="Admin Signup">
      <Card sectioned>
        <FormLayout>
          <TextField
            label="Name"
            value={form.name}
            onChange={handleChange('name')}
          />
          <TextField
            label="Email"
            type="email"
            value={form.email}
            onChange={handleChange('email')}
            autoComplete="email"
          />
          <TextField
            label="Password"
            type="password"
            value={form.password}
            onChange={handleChange('password')}
          />
          <Button primary onClick={handleSignup}>
            Sign Up
          </Button>
          <TextContainer>
            Already have an account? <a href="/admin/login">Log in</a>
          </TextContainer>
        </FormLayout>
      </Card>
    </Page>
  );
}
