int readLocks(String jsonData){
  char result = 0;
  for(int i = 0; jsonData[i]; i++){
    if(jsonData[i] == ':'){
      if(jsonData[i+1] == 't'){
        result |= 1<<(jsonData[i-2] - '0');
      }
    }
  }
  return result;
}
