// Test script to verify admin password change functionality
import fetch from 'node-fetch';

async function testPasswordChange() {
  const baseURL = 'http://localhost:5000';
  
  try {
    console.log('🔐 Testing Admin Password Change Functionality...\n');
    
    // Step 1: Login as admin to get session
    console.log('1. Logging in as admin...');
    const loginResponse = await fetch(`${baseURL}/api/admin/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'admin@sirahababzaar.com',
        password: 'admin123'
      })
    });
    
    const loginResult = await loginResponse.json();
    console.log('Login response:', loginResult);
    
    if (!loginResponse.ok || !loginResult.success) {
      console.log('❌ Admin login failed');
      return;
    }
    
    const adminId = loginResult.user.id;
    console.log('✅ Admin login successful, ID:', adminId);
    
    // Step 2: Test password change with correct current password
    console.log('\n2. Testing password change with correct current password...');
    const changePasswordResponse = await fetch(`${baseURL}/api/admin/change-password`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        adminId: adminId,
        currentPassword: 'admin123',
        newPassword: 'newadmin456'
      })
    });
    
    const changeResult = await changePasswordResponse.json();
    console.log('Password change response:', changeResult);
    
    if (changePasswordResponse.ok && changeResult.success) {
      console.log('✅ Password change successful!');
      
      // Step 3: Test login with new password
      console.log('\n3. Testing login with new password...');
      const newLoginResponse = await fetch(`${baseURL}/api/admin/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: 'admin@sirahababzaar.com',
          password: 'newadmin456'
        })
      });
      
      const newLoginResult = await newLoginResponse.json();
      
      if (newLoginResponse.ok && newLoginResult.success) {
        console.log('✅ Login with new password successful!');
        
        // Step 4: Change password back to original
        console.log('\n4. Changing password back to original...');
        const revertResponse = await fetch(`${baseURL}/api/admin/change-password`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            adminId: adminId,
            currentPassword: 'newadmin456',
            newPassword: 'admin123'
          })
        });
        
        const revertResult = await revertResponse.json();
        if (revertResponse.ok && revertResult.success) {
          console.log('✅ Password reverted to original successfully!');
        } else {
          console.log('❌ Failed to revert password:', revertResult);
        }
      } else {
        console.log('❌ Login with new password failed:', newLoginResult);
      }
    } else {
      console.log('❌ Password change failed:', changeResult);
    }
    
    // Step 5: Test password change with wrong current password
    console.log('\n5. Testing password change with wrong current password...');
    const wrongPasswordResponse = await fetch(`${baseURL}/api/admin/change-password`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        adminId: adminId,
        currentPassword: 'wrongpassword',
        newPassword: 'shouldnotwork'
      })
    });
    
    const wrongPasswordResult = await wrongPasswordResponse.json();
    
    if (!wrongPasswordResponse.ok || wrongPasswordResult.error) {
      console.log('✅ Correctly rejected wrong current password:', wrongPasswordResult.error);
    } else {
      console.log('❌ Should have rejected wrong current password');
    }
    
    console.log('\n🎉 Password change testing completed!');
    
  } catch (error) {
    console.error('❌ Test failed with error:', error.message);
  }
}

testPasswordChange();