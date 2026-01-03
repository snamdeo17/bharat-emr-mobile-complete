import React, {useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {colors} from '../../config/theme';
import Input from '../common/Input';
import Button from '../common/Button';

const TestInput = ({tests = [], onTestsChange}) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [currentTest, setCurrentTest] = useState({
    testName: '',
    instructions: '',
  });

  const handleAddTest = () => {
    if (currentTest.testName) {
      onTestsChange([...tests, currentTest]);
      setCurrentTest({
        testName: '',
        instructions: '',
      });
      setShowAddForm(false);
    }
  };

  const handleRemoveTest = index => {
    const updated = tests.filter((_, i) => i !== index);
    onTestsChange(updated);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.label}>Tests & Investigations</Text>
        {!showAddForm && (
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => setShowAddForm(true)}>
            <Icon name="plus-circle" size={24} color={colors.primary} />
            <Text style={styles.addButtonText}>Add Test</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Test List */}
      {tests.map((test, index) => (
        <View key={index} style={styles.testCard}>
          <View style={styles.testContent}>
            <Text style={styles.testName}>{test.testName}</Text>
            {test.instructions && (
              <Text style={styles.instructions}>{test.instructions}</Text>
            )}
          </View>
          <TouchableOpacity onPress={() => handleRemoveTest(index)}>
            <Icon name="close-circle" size={24} color={colors.error} />
          </TouchableOpacity>
        </View>
      ))}

      {/* Add Test Form */}
      {showAddForm && (
        <View style={styles.form}>
          <Input
            label="Test Name *"
            placeholder="e.g., Complete Blood Count"
            value={currentTest.testName}
            onChangeText={text =>
              setCurrentTest({...currentTest, testName: text})
            }
          />
          <Input
            label="Instructions"
            placeholder="e.g., Fasting required"
            value={currentTest.instructions}
            onChangeText={text =>
              setCurrentTest({...currentTest, instructions: text})
            }
            multiline
            numberOfLines={2}
          />

          <View style={styles.formActions}>
            <Button
              title="Cancel"
              onPress={() => setShowAddForm(false)}
              variant="outline"
              style={styles.formButton}
            />
            <Button
              title="Add"
              onPress={handleAddTest}
              style={styles.formButton}
            />
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  addButtonText: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '600',
    marginLeft: 4,
  },
  testCard: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    alignItems: 'flex-start',
  },
  testContent: {
    flex: 1,
  },
  testName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  instructions: {
    fontSize: 12,
    color: colors.textSecondary,
    fontStyle: 'italic',
  },
  form: {
    backgroundColor: colors.surface,
    padding: 16,
    borderRadius: 8,
    marginTop: 12,
  },
  formActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  formButton: {
    flex: 0.48,
  },
});

export default TestInput;
