import React, { useState, useEffect } from 'react';
import { Container, Typography, Card, CardContent, Grid, TextField, MenuItem, CircularProgress, List, ListItem, ListItemText, Divider, Box } from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledContainer = styled(Container)(({ theme }) => ({
  paddingTop: theme.spacing(4),
  paddingBottom: theme.spacing(4),
}));

const StyledCard = styled(Card)(({ theme }) => ({
  backgroundColor: '#0a1f3a',
  color: '#ffffff',
  borderRadius: '12px',
  boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)',
  marginBottom: theme.spacing(3),
}));

const CategoryCard = styled(Card)(({ theme }) => ({
  backgroundColor: '#1a3a6a',
  color: '#ffffff',
  borderRadius: '8px',
  marginBottom: theme.spacing(2),
  transition: 'transform 0.2s',
  '&:hover': {
    transform: 'translateY(-4px)',
  },
}));

const BudgetSuggestionPage = () => {
  const [budgetData, setBudgetData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());
  
  const email = localStorage.getItem('email') || '';

  useEffect(() => {
    fetchBudgetSuggestions();
  }, [month, year]);

  const fetchBudgetSuggestions = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `http://localhost:5000/api/budget/suggestion?email=${encodeURIComponent(email)}&month=${month}&year=${year}`
        
      );
      console.log(response)
      if (!response.ok) {
        throw new Error('Failed to fetch budget suggestions');
        
      }
      const data = await response.json();
      setBudgetData(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleMonthChange = (e) => {
    setMonth(e.target.value);
  };

  const handleYearChange = (e) => {
    setYear(e.target.value);
  };

  const months = [
    { value: 1, label: 'January' },
    { value: 2, label: 'February' },
    { value: 3, label: 'March' },
    { value: 4, label: 'April' },
    { value: 5, label: 'May' },
    { value: 6, label: 'June' },
    { value: 7, label: 'July' },
    { value: 8, label: 'August' },
    { value: 9, label: 'September' },
    { value: 10, label: 'October' },
    { value: 11, label: 'November' },
    { value: 12, label: 'December' },
  ];

  const years = Array.from({ length: 10 }, (_, i) => new Date().getFullYear() + i - 5);

  return (
    <StyledContainer maxWidth="md">
      <Typography variant="h4" component="h1" gutterBottom sx={{ color: '#ffffff', fontWeight: 'bold', mb: 4 }}>
        Budget Suggestions
      </Typography>
      
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6}>
          <TextField
            select
            label="Month"
            value={month}
            onChange={handleMonthChange}
            fullWidth
            variant="outlined"
            sx={{
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: '#3a5a8a',
                },
                '&:hover fieldset': {
                  borderColor: '#4a7aba',
                },
              },
              '& .MuiInputLabel-root': {
                color: '#a0b3d0',
              },
              '& .MuiSelect-select': {
                color: '#ffffff',
              },
            }}
          >
            {months.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            select
            label="Year"
            value={year}
            onChange={handleYearChange}
            fullWidth
            variant="outlined"
            sx={{
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: '#3a5a8a',
                },
                '&:hover fieldset': {
                  borderColor: '#4a7aba',
                },
              },
              '& .MuiInputLabel-root': {
                color: '#a0b3d0',
              },
              '& .MuiSelect-select': {
                color: '#ffffff',
              },
            }}
          >
            {years.map((year) => (
              <MenuItem key={year} value={year}>
                {year}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
      </Grid>

      {loading && (
        <Box display="flex" justifyContent="center" my={4}>
          <CircularProgress sx={{ color: '#4a7aba' }} />
        </Box>
      )}

      {error && (
        <StyledCard>
          <CardContent>
            <Typography color="error">{error}</Typography>
          </CardContent>
        </StyledCard>
      )}

      {budgetData && !loading && (
        <>
          <StyledCard>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ color: '#4a7aba', fontWeight: 'bold' }}>
                Financial Summary for {months.find(m => m.value === month)?.label} {year}
              </Typography>
              <Typography paragraph sx={{ color: '#c0d3f0' }}>
                {budgetData.summary}
              </Typography>
              <Typography sx={{ color: '#4a7aba', fontWeight: 'bold', mt: 2 }}>
                {budgetData.savingsTarget}
              </Typography>
            </CardContent>
          </StyledCard>

          <Grid container spacing={3} sx={{ mt: 1 }}>
            <Grid item xs={12} md={8}>
              <StyledCard>
                <CardContent>
                  <Typography variant="h6" gutterBottom sx={{ color: '#4a7aba', fontWeight: 'bold' }}>
                    Recommended Budget Allocation
                  </Typography>
                  {budgetData.recommendedBudget.map((item, index) => (
                    <CategoryCard key={index}>
                      <CardContent>
                        <Grid container alignItems="center" spacing={2}>
                          <Grid item xs={6}>
                            <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                              {item.category}
                            </Typography>
                          </Grid>
                          <Grid item xs={3}>
                            <Typography variant="body1" align="right">
                              {item.amount >= 0 ? `$${item.amount}%` : `-$${Math.abs(item.amount)}%`}
                            </Typography>
                          </Grid>
                          <Grid item xs={12} sx={{ mt: 1 }}>
                            <Typography variant="body2" sx={{ color: '#a0b3d0', fontStyle: 'italic' }}>
                              {item.suggestion}
                            </Typography>
                          </Grid>
                        </Grid>
                      </CardContent>
                    </CategoryCard>
                  ))}
                </CardContent>
              </StyledCard>
            </Grid>

            <Grid item xs={12} md={4}>
              <StyledCard>
                <CardContent>
                  <Typography variant="h6" gutterBottom sx={{ color: '#4a7aba', fontWeight: 'bold' }}>
                    Actionable Advice
                  </Typography>
                  <List dense>
                    {budgetData.actionableAdvice.map((advice, index) => (
                      <React.Fragment key={index}>
                        <ListItem>
                          <ListItemText
                            primary={advice}
                            primaryTypographyProps={{ sx: { color: '#ffffff' } }}
                          />
                        </ListItem>
                        {index < budgetData.actionableAdvice.length - 1 && (
                          <Divider component="li" sx={{ backgroundColor: '#3a5a8a' }} />
                        )}
                      </React.Fragment>
                    ))}
                  </List>
                </CardContent>
              </StyledCard>
            </Grid>
          </Grid>
        </>
      )}
    </StyledContainer>
  );
};

export default BudgetSuggestionPage;